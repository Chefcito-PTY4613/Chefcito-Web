export const runAll = (arr: Array<Function>) => {
  arr.forEach((fn) => {
    return fn();
  });
};

export const noNullStr = (arr: Array<String>) =>
  arr.reduce((acc, cur) => {
    if (acc === false) return false;
    if (cur === undefined) acc = false;
    if (cur === null) acc = false;
    if (cur === "") acc = false;
    return acc;
  }, true);

export const transforDateTime = (date: string) =>
  `${new Date(date).getHours()}:${new Date(date).getMinutes()}`;
export const transforDate = (date: string) =>
  `${new Date(date).getDate()}/${new Date(date).getMonth() + 1}`;

export const optionals = (
  ops: Record<string, unknown>
): Record<string, unknown> => {
  const toUpdate: Record<string, unknown> = {};

  Object.keys(ops).forEach((key) => {
    if (ops[key] !== undefined) toUpdate[key] = ops[key];
  });

  return toUpdate;
};

export async function reduceImageResolution(imageFile: File): Promise<{
  sizeOrg?: number;
  sizeNew?: number;
  img?: File;
}> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const image = new Image();

    image.src = URL.createObjectURL(imageFile);

    image.onload = () => {
      const originalWidth = image.naturalWidth;
      const originalHeight = image.naturalHeight;

      const size = Math.min(originalWidth, originalHeight);
      const newWidth = 1000;
      const newHeight = 1000;

      canvas.width = newWidth;
      canvas.height = newHeight;

      const sourceX = (originalWidth - size) / 2;
      const sourceY = (originalHeight - size) / 2;
      const sourceWidth = size;
      const sourceHeight = size;

      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        newWidth,
        newHeight
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const reducedImage = new File([blob], imageFile.name, {
              type: "image/webp",
            });

            resolve({
              sizeOrg: imageFile.size,
              sizeNew: reducedImage.size,
              img: reducedImage,
            });
          } else {
            reject(new Error("Error processing image"));
          }
        },
        "image/webp",
        1
      );
    };

    image.onerror = () => {
      reject(new Error("Error loading image"));
    };
  });
}
export const bytesToMB = (bytes: number) => {
  return (bytes / (1024 * 1024)).toFixed(3);
}
