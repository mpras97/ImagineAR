
import numpy as np
import cv2
import glob
from .helpers import *

SAMPLES_TO_GENERATE = 20
SCALE_START = 0.2
SCALE_END = 1.0

ED_MIN_VAL = 50
ED_MAX_VAL = 200

def find_normal_template(template, image, algo=cv2.TM_CCORR_NORMED):
    """
    The method finds the template within the image with normal template matching while considering resized
    images
    """

    found = None
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    template = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY)
    template = cv2.Canny(template, ED_MIN_VAL, ED_MAX_VAL)

    TEMP_THRESHOLD = 0.25

    (tH, tW) = template.shape[:2]

    for scale in np.linspace(SCALE_START, SCALE_END, SAMPLES_TO_GENERATE)[::-1]:
        resized = resize(gray, width= int(gray.shape[1] * scale))

        r = gray.shape[1] / float(resized.shape[1])

        if resized.shape[0] < tH or resized.shape[1] < tW:
            break

        edged = cv2.Canny(resized, ED_MIN_VAL, ED_MAX_VAL)

        result = cv2.matchTemplate(edged, template, algo)

        (_, maxVal, _, maxLoc) = cv2.minMaxLoc(result)

        if found is None or maxVal > found[0]:
            found = (maxVal, maxLoc, r)

    if found[0] > TEMP_THRESHOLD:
        return True

    return False


def find_img_pyramid_template(template, image, algo=cv2.TM_CCORR_NORMED):
    """
    The method finds the template in the image by consstructing the respective image pyramids,
    and corrrelating them to find the image
    """

    TEMP_THRESHOLD = 0.9
    IMG_CONVERT_THRESHOLD = 255

    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray_template = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY)

    image_pyramid = buildPyramid(gray_image)
    template_pyramid = buildPyramid(gray_template)

    results = []

    for i in range(len(image_pyramid)):

        local_img = image_pyramid[i]
        local_template = template_pyramid[i]

        local_template_th = cv2.adaptiveThreshold(local_template, IMG_CONVERT_THRESHOLD, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        local_img_th = cv2.adaptiveThreshold(local_img, IMG_CONVERT_THRESHOLD, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)

        # if i == 0:

            # cv2.imshow("th", th)
            # exit_img_show()

        result = cv2.matchTemplate(local_img_th, local_template_th, algo)

        (_, maxVal, _, maxLoc) = cv2.minMaxLoc(result)

            # cv2.imshow("a", th)
            # exit_img_show()
            # results.append(threshed)
        # else:
        #     # mask = gaussian_pyramid(threshed)

        #     # for m in mask:
        #     #     cv2.imshow("m", m)

        #     #     exit_img_show()

        #     edged = cv2.Canny(mask, ED_MIN_VAL, ED_MAX_VAL)
        #     contours = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)[-2]

        #     tH, tW = local_template.shape[:2]

    img_threshold = max(results)

    (_, maxVal, _, maxLoc) = cv2.minMaxLoc(img_threshold)
    if maxVal > TEMP_THRESHOLD:
        return True

    return False

def find_img_with_updated_perspective(template, image, algo=cv2.TM_CCORR_NORMED):
    """
    Tries to update perspective for the given image and check the match
    """

    TEMP_THRESHOLD = 0.7

    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray_template = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY)

    image_pyramid = buildPyramid(gray_image)
    template_pyramid = buildPyramid(gray_template)

    for scale in np.linspace(SCALE_START, SCALE_END, SAMPLES_TO_GENERATE)[::-1]:
        resized = resize(gray_image, width=int(gray_image.shape[1] * scale))

        r = gray_image.shape[1] / float(resized.shape[1])

        if resized.shape[0] < tH or resized.shape[1] < tW:
            break

        edged = cv2.Canny(resized, ED_MIN_VAL, EC_MAX_VAL)
        result = cv2.matchTemplate(edged, gray_template, algo)

        (_, maxVal, _, maxLoc) = cv2.minMaxLoc(result)

        if found is None or maxVal > found[0]:
            found = (maxVal, maxLoc, r)

        if found < TEMP_THRESHOLD:
            # We try changing the perspective to fishhole cam and see the case

            up_pts = [maxLoc, (maxLoc.x+gray_template.x, maxLoc.y), (maxLoc.x, maxLoc.y+gray_template.y), (maxLoc.x+gray_template.x, maxLoc.y+gray_template.y)]
            rect = order_points(up_pts)

            warped = four_point_transform(resized, rect)

            edged = cv2.Canny(warped, ED_MIN_VAL, ED_MAX_VAL)
            result = cv2.matchTemplate(edged, gray_template, algo)

            (_, maxVal, _, maxLoc) = cv2.minMaxLoc(result)

            found2 = (maxVal, maxLoc, r)

            if found2 > found:
                found = found2

    if found > TEMP_THRESHOLD:
        return True

    return False


def find_img_based_upon_feature_match(template, image):
    """
    The method is being used for template detection using orb
    """
    pass
