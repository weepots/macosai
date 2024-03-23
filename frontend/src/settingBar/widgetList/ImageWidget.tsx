import React, { useEffect, useState } from "react";
import { Button, Col, Figure, Row, Form } from "react-bootstrap";
import { nanoid } from "nanoid";
import presetImageList from "../../config/image.json";
import { ImageItemKind } from "../../view/object/image";
import colorStyles from "../../style/color.module.css";
import borderStyles from "../../style/border.module.css";
import sizeStyles from "../../style/size.module.css";
import spaceStyles from "../../style/space.module.css";
import displayStyles from "../../style/display.module.css";
import alignStyles from "../../style/align.module.css";
import fontStyles from "../../style/font.module.css";
import Drag from "../../util/Drag";
import TRIGGER from "../../config/trigger";
import useImageAsset from "../../hook/useImageAsset";
import useI18n from "../../hook/usei18n";

export const IMAGE_LIST_KEY = "importedImage";

const ImageWidget: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const { setImageAsset, getAllImageAsset } = useImageAsset();
  const { getTranslation } = useI18n();
  const [imageAssetList, setImageAssetList] = useState(() => {
    if (getAllImageAsset().length) {
      return [...getAllImageAsset()!];
    }
    setImageAsset(presetImageList);
    return [...presetImageList];
  });
  const allImageAsset = getAllImageAsset();
  useEffect(() => {
    setImageAssetList(allImageAsset);
  }, [allImageAsset]);

  const checkFileSize = (s: string, maxSize: number) => {
    const num_bytes = s.length;

    if (num_bytes > maxSize * 1000000) {
      return false;
    } else {
      return true;
    }
  };

  const uploadImage = () => {
    const fileReader = new FileReader();
    const max_file_size = 10;
    fileReader.onload = () => {
      const temp = fileReader.result as string;
      if (checkFileSize(temp, max_file_size) === false) {
        window.alert(`Maximum File size Exceeded: ${max_file_size}MB.`);
        return false;
      }
      setImageAssetList((prev) => {
        const result = [
          {
            type: "image",
            id: nanoid(),
            name: "imported image",
            src: fileReader.result as string,
          },
          ...prev,
        ];
        setImageAsset(result);
        window.alert(`Image file successfully added to the Asset List.`);
        return result;
      });
    };
    const file = document.createElement("input");
    file.type = "file";
    file.accept = "image/png, image/jpeg";
    file.onchange = (e) => {
      const event = e;
      if (event.target && (event.target as HTMLInputElement).files) {
        Object.values((event.target as HTMLInputElement).files!).forEach((file) => {
          fileReader.readAsDataURL(file);
        });
      }
    };
    file.click();
  };

  return (
    <Col className={[sizeStyles["mx-h-30vh"]].join(" ")}>
      <Row className={[alignStyles["absoluteCenter"]].join(" ")}>
        <Button
          className={[
            colorStyles.greyTheme,
            borderStyles.none,
            displayStyles["inline-block"],
            sizeStyles.width80,
            alignStyles["absoluteCenter"],
            spaceStyles.pt1rem,
          ].join(" ")}
          onClick={uploadImage}
        >
          <h6>Add Image to Assets</h6>
          {/* <Row>
            <Col xs={1}>
              <i className="bi-plus" />
            </Col>
            <Col className={[alignStyles["absolute-center"]].join(" ")}>
              <h6>Add Image to Assets</h6>
            </Col>
          </Row> */}
        </Button>
        <h6 className="mt-3">Asset List</h6>
      </Row>
      <Row xs={2}>
        {imageAssetList.map((_data) => (
          <ImageThumbnail
            key={`image-thumbnail-${_data.id}`}
            data={{
              id: _data.id,
              src: _data.src ?? `find:${_data.id}`,
              name: _data.name,
              "data-item-type": _data.type,
            }}
            maxPx={80}
          />
        ))}
      </Row>
    </Col>
  );
};

export default ImageWidget;

const ImageThumbnail: React.FC<{
  maxPx: number;
  data: Omit<ImageItemKind, "image">;
}> = ({ data: { id, ...data }, maxPx }) => {
  const { getImageAssetSrc } = useImageAsset();
  return (
    <Figure as={Col} className={[alignStyles.absoluteCenter, alignStyles.wrapTrue].join(" ")}>
      <Drag
        dragType="copyMove"
        dragSrc={{
          trigger: TRIGGER.INSERT.IMAGE,
          "data-item-type": data["data-item-type"],
          src: data.src.startsWith("data:") ? data.src : `${process.env.PUBLIC_URL}/assets/image/${data.src}`,
        }}
      >
        <Figure.Image
          alt={data.name}
          src={data.src.startsWith("data:") ? data.src : `${process.env.PUBLIC_URL}/assets/image/${data.src}`}
        />
      </Drag>
      <Figure.Caption className={[fontStyles.font075em, sizeStyles.width100, "text-center"].join(" ")}>
        {data.name}
      </Figure.Caption>
    </Figure>
  );
};
