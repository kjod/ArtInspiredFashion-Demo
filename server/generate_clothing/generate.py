from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from PIL import Image
import os
import numpy as np
import json
import torch
import torchvision.transforms as transforms
from torchvision.utils import save_image
from types import SimpleNamespace
from ArtInspiredFashionHR.analysis.fid_score import load_model
import uuid

painting_loc = '../app/public/images/'

@csrf_exempt 
def create(request):
    print(request)
    name = str(uuid.uuid4())
    #print(request.data)
    artwork = request.POST.get('artwork') 
    clothing_type = request.POST.get('type')
    coordinates = json.loads(request.POST.get('coordinates'))
    
    img_path = os.path.join(painting_loc)
    gen_path = os.path.join(img_path, 'generated_images')
    painting = Image.open(os.path.join(img_path, 'example' + artwork + '.jpg'))
    painting = painting.resize((1000, 1000)) #TODO check resize for SIFT and HOG

    array = np.linspace(1, 1, painting.width * painting.height * 3)
    mat = np.reshape(array, (painting.height, painting.width, 3))
    img = Image.fromarray(np.uint8(mat * 255))

    image_copy = img.copy()
    painting = painting.resize((int(abs(coordinates['x2'] - coordinates['x1'])) , int(abs(coordinates['y2'] - coordinates['y1']))))
    position = (int(coordinates['x1']), int(coordinates['y1']))
    image_copy.paste(painting, position)

    if not os.path.exists(gen_path):
        os.mkdir(gen_path)

    new_path = os.path.join(gen_path, name + '.png')
    image_copy.save(new_path)

    ##load model
    model_param_loc ='/home/kieran/Documents/college/AIF_Paper_Demo/server/ArtInspiredFashionHR/analysis/results/Graphic_t-shirt_dress_high_res_fake_rec/model_params.json'
    model_path ='/home/kieran/Documents/college/AIF_Paper_Demo/server/ArtInspiredFashionHR/analysis/results/Graphic_t-shirt_dress_high_res_fake_rec/model/'
    model_iter = 90000
    model_name = 'G_B'

    with open(model_param_loc, 'r') as f:
        model_param = json.load(f)

    model_param['continue_train'] = False
    
    if not torch.cuda.is_available():
        print('Changing')
        model_param['gpu_ids'] = '-1'

    model_args = SimpleNamespace(**model_param)
 
    transform = transforms.Compose([transforms.Resize((model_args.img_size, model_args.img_size), ),  # Image.BICUBIC), #Temp
                                        transforms.ToTensor(),
                                        transforms.Normalize((model_args.mean, model_args.mean, model_args.mean),
                                                             (model_args.sd, model_args.sd, model_args.sd))
                                        ])

    model, model_args = load_model(model_param_loc, model_path, model_iter) 
    model.load_weights(model_path, model_iter)

    ##save generated image
    image_copy = image_copy.convert('RGB')
    image_copy = transform(image_copy)
    image_copy = torch.unsqueeze(image_copy, 0)
            
    batch =  {'Painting': image_copy, 'Dress': image_copy, 'Bb': image_copy, 'Bb_reverse': image_copy, 'label': clothing_type}
    model.set_input(batch, model_args)
    fake = model.__dict__['G_B'](model.real_B)
    
    save_image(model.unorm(fake.data),
                           '%s' % (new_path), normalize=False)
    painting = Image.open(new_path)
    print('Fini')
    
    return JsonResponse({"generated_image": name + '.png'})