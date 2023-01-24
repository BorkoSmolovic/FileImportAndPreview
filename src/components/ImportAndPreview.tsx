import "./ImportAndPreview.scss";
import { useRef, useState } from "react";
import Modal from "react-modal";

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
          tumbnailDetails: getTumbnailDetails(readerEvent, selectedFile),
          isImage: selectedFile.type.includes("image") ? true : false,
          filePreview: readerEvent.target.result,
        },
      ];
      setImportedFiles(allFiles);

      // setDetails(readerEvent, selectedFile);
    };
  }

  function getTumbnailDetails(
    readerEvent: ProgressEvent<FileReader>,
    selectedFile: File
  ) {
    let tumbnailDetails = {
      resolution: "",
      duration: 0,
      size: 0,
      type: "",
    };
    if (!readerEvent || !readerEvent.target) return tumbnailDetails;

    if (selectedFile.type.includes("image")) {
      let img: any = new Image();
      img.src = readerEvent.target.result;
      console.log("UDJEL#########333333333333", img.width);
      img.onload = function () {
        return {
          resolution: ((img.width as string) + "x" + img.height) as string,
          duration: 0,
          size: selectedFile.size,
          type: selectedFile.type,
        };
      };
    }
    return tumbnailDetails;
  }

  function preview(fullSize: boolean, customClass?: string) {
    let items: any = [];
    importedFiles?.map((item, index) => {
      if (item.isImage) {
        items.push(
          <div className="import-and-preview__thumbnail_item" key={index}>
            <span>
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
          </div>
        );
      } else {
        items.push(
          <div className="import-and-preview__thumbnail_item" key={index}>
            <span>
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
          </div>
        );
      }
    });
    console.log("test", items);
    return items;
  }

  function handleVideoMetadata(index: number) {
    const video = videoRef.current[index];
    if (!video) return;

    // setTumbnalDetails({
    //   resolution:
    //     (video as HTMLVideoElement).videoWidth +
    //     "x" +
    //     (video as HTMLVideoElement).videoHeight,
    //   duration: Math.round((video as HTMLVideoElement).duration * 100) / 100,
    //   size: tumbnailDetails.size,
    //   type: tumbnailDetails.type,
    // });
  }

  return (
    <div className="import-and-preview">
      <h1 className="import-and-preview__title">Import file</h1>
      <div>
        <input accept="image/*, video/*" onChange={previewFile} type="file" />
      </div>
      <div>
        <span
          onClick={() => setOpenPreview(true)}
          className="import-and-preview__thumbnail_container"
        >
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
