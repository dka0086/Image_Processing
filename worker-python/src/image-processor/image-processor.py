import pyvips
import numpy as np

def getImage(imageName):
    image = pyvips.Image.new_from_file(imageName, access='sequential')
    return image

def doubleSizeImage(imageName, outputPath):
    image = getImage(imageName)
    imageResized = image.resize(2.0)
    imageResized.write_to_file(outputPath)
    return imageResized

#Fazer o Lanczos3
def lanczos3(x):
    if abs(x) == 0:
        return 1
    if abs(x) >= 3:
        return 0
    return np.sinc(x)*np.sinc(x/3)

def lanczos2D(dx, dy):
    return lanczos3(dy)*lanczos3(dx)

def clamp(imgArray, u, v):
    h, w = imgArray.shape[0], imgArray.shape[1]
    u = min(max(u, 0), w-1)
    v = min(max(v, 0), h-1)
    return imgArray[u,v].astype(np.float64)

def interpolateLanczos3()

def filterBlackAndWhite(imageName, outputPath):
    image = getImage(imageName)
    img_BW = image.colourspace('b-w')
    img_BW = image.write_to_file(outputPath)
    return img_BW


