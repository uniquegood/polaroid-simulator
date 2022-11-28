import { useEffect, useRef, useState } from "react";

function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
  if (arguments.length === 2) {
    x = y = 0;
    w = ctx.canvas.width;
    h = ctx.canvas.height;
  }

  // default offset is center
  offsetX = typeof offsetX === "number" ? offsetX : 0.5;
  offsetY = typeof offsetY === "number" ? offsetY : 0.5;

  // keep bounds [0.0, 1.0]
  if (offsetX < 0) offsetX = 0;
  if (offsetY < 0) offsetY = 0;
  if (offsetX > 1) offsetX = 1;
  if (offsetY > 1) offsetY = 1;

  var iw = img.width,
    ih = img.height,
    r = Math.min(w / iw, h / ih),
    nw = iw * r, // new prop. width
    nh = ih * r, // new prop. height
    cx,
    cy,
    cw,
    ch,
    ar = 1;

  // decide which gap to fill
  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh; // updated
  nw *= ar;
  nh *= ar;

  // calc source rectangle
  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  // make sure source rectangle is valid
  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  // fill image in dest. rectangle
  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

const brightnessFilter = (pixels, progress) => {
  let d = pixels.data;
  const p = Math.max(1 - progress, 0.2);

  for (var i = 0; i < d.length; i += 4) {
    d[i] = Math.min(255, d[i] + p * 255);
    d[i + 1] = Math.min(255, d[i + 1] + p * 255);
    d[i + 2] = Math.min(255, d[i + 2] + p * 255);
    d[i + 3] = Math.round(255 * progress);
  }
  return pixels;
};

const Polaroid = ({ width, height, progress, src, style }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const [imgLoaded, setImgLoaded] = useState(null);

  useEffect(() => {
    setImgLoaded(false);
  }, [src]);

  useEffect(() => {
    if (imgLoaded === null || imgLoaded === true) {
      return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      imageRef.current = img;
      setImgLoaded(true);
    };
    img.src = src;
  }, [imgLoaded]);

  useEffect(() => {
    console.log(imgLoaded, canvasRef.current);
    if (
      imgLoaded === null ||
      imgLoaded === false ||
      canvasRef.current === null
    ) {
      return;
    }

    const ctx = canvasRef.current.getContext("2d");

    drawImageProp(ctx, imageRef.current, 0, 0, width, height);

    let pixels = ctx.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    pixels = brightnessFilter(pixels, progress);
    ctx.putImageData(pixels, 0, 0);
  }, [imgLoaded, progress]);

  return (
    <canvas
      ref={canvasRef}
      style={{ maxWidth: "100%", ...style }}
      width={width}
      height={height}
    ></canvas>
  );
};

export default Polaroid;
