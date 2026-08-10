import pyvips
import numpy as np

#image filter

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
    return imgArray[v,u].astype(np.float64)

def interpolateLanczos3(imgArray, x0, y0):
    fx0 = int(np.floor(x0))
    fy0 = int(np.floor(y0))

    if imgArray.ndim == 2:
        acc = 0.0
    else:
        acc = np.zeros(imgArray.shape[2], dtype=np.float64)

    for j in range(6):
        vj = fy0 + j - 2
        w_l3y = lanczos3(y0-vj)
        if w_l3y == 0:
            continue #Pula a iteração

        rowSum = 0.0 if imgArray.ndim == 2 else np.zeros(imgArray.shape[2], dtype=np.float64)
        for i in range(6):
            ui = fx0 + i - 2
            w_l3x = lanczos3(x0 - ui)
            if w_l3x == 0:
                continue #Pula a iteração
            rowSum = rowSum + clamp(imgArray, ui, vj)*w_l3x
 
        acc = acc + w_l3y * rowSum
 
    return acc

#Inverse mapping
def resizeLanczos3(imageName, outputPath, scale):
    image = getImage(imageName)
    imgArray = image.numpy()  

    inH, inW = imgArray.shape[0], imgArray.shape[1]
    outH = int(round(inH * scale))
    outW = int(round(inW * scale))

    sy = inH / outH
    sx = inW / outW

    if imgArray.ndim == 2:
        out = np.zeros((outH, outW), dtype=np.float64)
    else:
        out = np.zeros((outH, outW, imgArray.shape[2]), dtype=np.float64)

    for oy in range(outH):
        y0 = (oy + 0.5) * sy - 0.5
        for ox in range(outW):
            x0 = (ox + 0.5) * sx - 0.5
            out[oy, ox] = interpolateLanczos3(imgArray, x0, y0)

    out = np.clip(out, 0, 255).astype(np.uint8)

    outImage = pyvips.Image.new_from_array(out)
    outImage.write_to_file(outputPath)
    return outImage

def filterBlackAndWhite(imageName, outputPath):
    image = getImage(imageName)
    img_BW = image.colourspace('b-w')
    img_BW.image.write_to_file(outputPath)
    return img_BW

def toJPEG(imageName, outputPath, quality=85):
    image = getImage(imageName)
    image.jpegsave(outputPath, Q=quality)  
    return image

def toPNG(imageName, outputPath, compression=6):
    image = getImage(imageName)
    image.pngsave(outputPath, C=compression)  
    return image

def toWEBP(imageName, outputPath, quality=85):
    image = getImage(imageName)
    image.webpsave(outputPath, Q=quality)  
    return image