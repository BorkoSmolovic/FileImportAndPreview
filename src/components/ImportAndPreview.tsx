import "./ImportAndPreview.scss";
import { useRef, useState } from "react";
import Modal from "react-modal";

interface tumbnailDetails {
  resolution: string;
  duration: number;
  size: number;
  type: string;
}

export default function ImportAndPreview() {
  const [imagePreview, setImagePreview] = useState<
    string | ArrayBuffer | null | undefined
  >(null);
  const [videoPreview, setVideoPreview] = useState<
    string | ArrayBuffer | null | undefined
  >(null);
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [tumbnailDetails, setTumbnalDetails] = useState<tumbnailDetails>({
    resolution: "",
    duration: 0,
    size: 0,
    type: "",
  });
  const videoRef = useRef(null);

  function previewFile(e: React.FormEvent<HTMLInputElement>) {
    const reader: FileReader = new FileReader();
    clearFiles();
    if (!e.target) return;

    const target = e.target as HTMLInputElement;

    if (!target.files) return;

    const selectedFile = target.files[0];

    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
    reader.onload = (readerEvent) => {
      if (!readerEvent.target) return;
      if (selectedFile.type.includes("image")) {
        setImagePreview(readerEvent.target.result);
      } else if (selectedFile.type.includes("video")) {
        setVideoPreview(readerEvent.target.result);
      }
      setDetails(readerEvent, selectedFile);
    };
  }

  function setDetails(
    readerEvent: ProgressEvent<FileReader>,
    selectedFile: File
  ) {
    if (!readerEvent || !readerEvent.target) return;

    if (selectedFile.type.includes("image")) {
      let img: any = new Image();
      img.src = readerEvent.target.result;
      img.onload = function () {
        setTumbnalDetails({
          resolution: ((img.width as string) + "x" + img.height) as string,
          duration: 0,
          size: selectedFile.size,
          type: selectedFile.type,
        });
      };
    } else if (selectedFile.type.includes("video")) {
      setTumbnalDetails({
        resolution: tumbnailDetails.resolution,
        duration: tumbnailDetails.duration,
        size: selectedFile.size,
        type: selectedFile.type,
      });
    }
  }

  function preview(fullSize: boolean, customClass?: string) {
    if (imagePreview != null) {
      return (
        <img src={imagePreview as string} alt="" className={customClass} />
      );
    }

    if (videoPreview != null) {
      return (
        <video
          onLoadedMetadata={handleVideoMetadata}
          ref={videoRef}
          controls={fullSize ? true : false}
          src={videoPreview as string}
          className={customClass}
        ></video>
      );
    }

    return;
  }

  function handleVideoMetadata() {
    const video = videoRef.current;
    if (!video) return;

    setTumbnalDetails({
      resolution:
        (video as HTMLVideoElement).videoWidth +
        "x" +
        (video as HTMLVideoElement).videoHeight,
      duration: Math.round((video as HTMLVideoElement).duration * 100) / 100,
      size: tumbnailDetails.size,
      type: tumbnailDetails.type,
    });
  }

  function details() {
    if (!tumbnailDetails) return;

    if (imagePreview != null) {
      return (
        <ul>
          <li>Resolution: {tumbnailDetails.resolution}</li>
          <li>Size: {Math.round(tumbnailDetails.size / 10000) / 100}MB</li>
          <li>Type: {tumbnailDetails.type}</li>
        </ul>
      );
    }
    if (videoPreview != null) {
      return (
        <ul>
          <li>Resolution: {tumbnailDetails.resolution}</li>
          <li>Duration: {tumbnailDetails.duration}s</li>
          <li>Size: {Math.round(tumbnailDetails.size / 10000) / 100}MB</li>
          <li>Type: {tumbnailDetails.type}</li>
        </ul>
      );
    }
  }

  function clearFiles() {
    setImagePreview(null);
    setVideoPreview(null);
  }

  return (
    <div className="import-and-preview">
      <h1 className="import-and-preview__title">Import file</h1>
      <div>
        <input accept="image/*, video/*" onChange={previewFile} type="file" />
      </div>
      <div>
        <span onClick={() => setOpenPreview(true)}>
          {preview(false, "import-and-preview__thumbnail")}
        </span>
        {details()}
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
