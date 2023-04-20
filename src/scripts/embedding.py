import os
import cv2
import numpy as np
import sys
import base64

from segment_anything import sam_model_registry, SamPredictor

project_dir = os.path.dirname(os.path.abspath(__file__))
checkpoint = os.path.join(project_dir, "sam_vit_h_4b8939.pth")
model_type = "vit_h"


def base64_to_ndarray(base64_string):
    # 解码 base64 编码的字符串为二进制数据
    image_data = base64.b64decode(base64_string)

    # 将二进制数据解码为图片数据
    image = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_COLOR)

    # 将图片数据转换为 numpy.ndarray 类型
    return np.array(image)


def getEmbeddings(
    withCuda: bool,
    # output: str,
    url: str,
):
    sam = sam_model_registry[model_type](checkpoint=checkpoint)
    if withCuda:
        os.environ["CUDA_VISIBLE_DEVICES"] = ""
    else:
        sam.to(device="cuda")
    predictor = SamPredictor(sam)
    img_np = base64_to_ndarray(url)
    # save embedding
    # image = cv2.imread(url) #只能读取本地文件
    predictor.set_image(img_np)
    image_embedding = predictor.get_image_embedding().cpu().numpy()
    # 生成的文件存到指定地方
    np.save(os.path.join(project_dir, "npy", "output.npy"), image_embedding)


try:
    url = sys.argv[1]
    useCuda = sys.argv[2]
    print(url)
    getEmbeddings(bool(useCuda), url)
except Exception as e:
    sys.stderr.write(str(e))
    sys.stderr.flush()
    sys.exit(1)
