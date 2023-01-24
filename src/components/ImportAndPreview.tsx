import "./ImportAndPreview.scss";
import { useRef, useState } from "react";
import Modal from "react-modal";
import { idText } from "typescript";

interface tumbnailDetails {
  resolution: string;
  duration: number;
  size: number;
  type: string;
}

interface importedFile {
  tumbnailDetails: tumbnailDetails;
  isImage: boolean;
  filePreview: string | ArrayBuffer | null | undefined;
}

export default function ImportAndPreview() {
  const [importedFiles, setImportedFiles] = useState<importedFile[]>([]);
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [tempTumbnail, setTempTumbnail] = useState<tumbnailDetails>({
    resolution: "",
    duration: 0,
    size: 0,
    type: "",
  });
  const videoRef = useRef<Array<HTMLVideoElement | HTMLImageElement | null>>(
    []
  );

  function previewFile(e: React.FormEvent<HTMLInputElement>) {
    const reader: FileReader = new FileReader();
    if (!e.target) return;
    const target = e.target as HTMLInputElement;
    if (!target.files) return;
    const selectedFile = target.files[0];
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
    let allFiles = [];
    reader.onload = (readerEvent) => {
      if (!readerEvent.target) return;
      if (!importedFiles) return;
      allFiles = [
        ...importedFiles,
        {
          tumbnailDetails: {
            resolution: "",
            duration: 0,
            size: selectedFile.size,
            type: selectedFile.type,
          },
          isImage: selectedFile.type.includes("image") ? true : false,
          filePreview: readerEvent.target.result,
        },
      ];
      setImportedFiles(allFiles);
      if (selectedFile.type.includes("image")) {
        setImageResolution(readerEvent, allFiles);
      }
    };
  }

  function setImageResolution(
    readerEvent: ProgressEvent<FileReader>,
    allFiles: importedFile[]
  ) {
    if (!readerEvent || !readerEvent.target) return;
    let img: any = new Image();
    img.src = readerEvent.target.result;
    img.onload = function () {
      let str = img.width + "x" + img.height;
      setImageDetails(str, allFiles);
    };
  }

  function setImageDetails(str: string, allFiles: importedFile[]) {
    var newImportedFiles: importedFile[] = allFiles.map((item, index) => {
      if (index === allFiles.length - 1) {
        item.tumbnailDetails.resolution = str;
        return item;
      } else {
        return item;
      }
    });
    setImportedFiles(newImportedFiles);
  }

  function handleDelete(selectedIndex: number) {
    setImportedFiles(
      importedFiles.filter((item, index) => index !== selectedIndex)
    );
  }

  function preview(fullSize: boolean, customClass?: string) {
    let items: any = [];
    importedFiles?.map((item, index) => {
      if (item.isImage) {
        items.push(
          <div className="import-and-preview__thumbnail_item" key={index}>
            <span onClick={() => setOpenPreview(true)}>
              <img
                src={item.filePreview as string}
                alt=""
                className={customClass}
              />
            </span>
            <span>
              <ul>
                <li>Resolution: {item.tumbnailDetails.resolution}</li>
                <li>
                  Size: {Math.round(item.tumbnailDetails.size / 10000) / 100}MB
                </li>
                <li>Type: {item.tumbnailDetails.type}</li>
              </ul>
            </span>
            <div className="close" onClick={() => handleDelete(index)}>
              x
            </div>
          </div>
        );
      } else {
        items.push(
          <div className="import-and-preview__thumbnail_item" key={index}>
            <span onClick={() => setOpenPreview(true)}>
              <video
                onLoadedMetadata={() => handleVideoMetadata(index)}
                ref={(el) => (videoRef.current[index] = el)}
                controls={fullSize ? true : false}
                src={item.filePreview as string}
                className={customClass}
              ></video>
            </span>
            <span>
              <ul>
                <li>Resolution: {item.tumbnailDetails.resolution}</li>
                <li>Duration: {item.tumbnailDetails.duration}s</li>
                <li>
                  Size: {Math.round(item.tumbnailDetails.size / 10000) / 100}MB
                </li>
                <li>Type: {item.tumbnailDetails.type}</li>
              </ul>
            </span>
            <div className="close" onClick={() => handleDelete(index)}>
              x
            </div>
          </div>
        );
      }
    });
    return items;
  }

  function handleVideoMetadata(selectedIndex: number) {
    const video = videoRef.current[selectedIndex];
    if (!video) return;

    var newImportedFiles: importedFile[] = importedFiles.map((item, index) => {
      if (index === selectedIndex) {
        item.tumbnailDetails.resolution =
          (video as HTMLVideoElement).videoWidth +
          "x" +
          (video as HTMLVideoElement).videoHeight;
        item.tumbnailDetails.duration = (video as HTMLVideoElement).duration;
        return item;
      } else {
        return item;
      }
    });
    setImportedFiles(newImportedFiles);
  }

  return (
    <div className="import-and-preview">
      <h1 className="import-and-preview__title">Import file</h1>
      <div>
        <input accept="image/*, video/*" onChange={previewFile} type="file" />
      </div>
      <div>
        <span className="import-and-preview__thumbnail_container">
          {preview(false, "import-and-preview__thumbnail")}
        </span>
      </div>

      <Modal
        ariaHideApp={false}
        isOpen={openPreview}
        onRequestClose={() => setOpenPreview(false)}
        style={{
          content: { width: "fit-content", height: "fit-content" },
        }}
      >
        {preview(true)}
      </Modal>
    </div>
  );
}
