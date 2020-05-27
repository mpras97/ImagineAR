import numpy as np
import cv2
from skimage import feature
from scipy import ndimage

def translate(image, x, y):
    """
    Translate the image by x and y values in respective x and y axes
    """

    M = np.float32([1, 0, x], [0, 1, y])
    shifted = cv2.warpAffine(image, M, (image.shape[1], image.shape[0]))

    return shifted

def rotate(image, angle, center = None, scale = 1.0):
    """
    Rotate the image by the given angle around the center
    """

    (h, w) = image.shape[:2]

    if center is None:
        center = (w/2, h/2)

    M = cv2.getRotationMatrix2D(center, angle, scale)
    rotated = cv2.warpAffine(image, M, (w, h))

def resize(image, width = None, height = None, inter = cv2.INTER_AREA):
    """
    Resize the image based upon the given width and height
    """

    dim = None
    (h, w) = image.shape[:2]

    if width is None and height is None:
        return image

    if width is None:
        r = height / float(h)
        dim = (int(w * r), height)

    else:

        r = width / float(w)
        dim = (width, int(h * r))

    resized = cv2.resize(image, dim, interpolation=inter)

    return resized

def calculate_correlation_coeff(img1, img2):
    """
    Calculate the correlation coefficient for the template in the image
    """

    product = np.mean((img1 - img1.mean()) * (img2 - img2.mean()))
    stds = img1.std() * img2.std()

    if stds == 0:
        return 0
    else:
        product = product / stds
        return product

def gaussian_pyramid(image):
    """
    Return the gaussian_pyramid for the image
    """
    return cv2.pyrdown(image)

def laplacian_pyramid(image):
    """
    Return the laplacian pyramid for the image
    """
    return cv2.pyrup(image)

def buildPyramid(image, maxlevel=5):
    """
    Build image pyramid for maxLevel number of levels
    """
    imgpyr = [image]
    alter_img = image
    for i in range(0,maxlevel):
        alter_img = gaussian_pyramid(alter_img)
        imgpyr.append(alter_img)

    imgpyr.reverse()
    return imgpyr

def order_points(pts):
    """
    Returns a rectangle. The ordering
    should be correct, starting from top left to button left in clockwise order
    """

    rect = np.zeros((4, 2), dtype="float32")

    s = pts.sum(axis = 1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]

    diff = np.diff(pts, axis = 1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]

    return rect

def four_points_transform(image, pts):
    """
    Transforms the image to get a fishhole perspective and remove distortion
    """
    rect = order_points(pts)
    (tl, tr, br, bl) = rect

    widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    maxWidth = max(int(widthA), int(widthB))

    heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    maxHeight = max(int(heightA), int(heightB))

    dst = np.array([
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]], dtype = "float32")

    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))

    return warped
