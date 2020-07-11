
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
