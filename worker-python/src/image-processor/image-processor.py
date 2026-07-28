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

def interpolateLanczos3(imgArray, x0, y0):
    fx0 = int(np.floor(x0))
    fy0 = int(np.floor(y0))

    if imgArray.ndim == 2:
        acc = 0.0
    else:
        acc = np.zeros(imgArray.shape[2], dtype=np.float64)

    for j in range(6):
        vj = fy0 + j - 2
        wy = lanczos3(y0-vj)
        if wy == 0:
            continue

        rowSum = 0.0 if imgArray.ndim == 2 else np.zeros(imgArray.shape[2], dtype=np.float64)
        for i in range(6):
            ui = fx0 + i - 2
            wx = lanczos3(x0 - ui)
            if wx == 0:
                continue
            rowSum = rowSum + clamp(imgArray, ui, vj) * wx
 
        acc = acc + wy * rowSum
 
    return acc

def filterBlackAndWhite(imageName, outputPath):
    image = getImage(imageName)
    img_BW = image.colourspace('b-w')
    img_BW = image.write_to_file(outputPath)
    return img_BW


