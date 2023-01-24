import { Dispatch, SetStateAction } from "react";
import "./Modal.scss";

interface selectedFile {
  file: string | ArrayBuffer | null | undefined;
  isImage: boolean;
}

interface Props {
  selectedFile: selectedFile;
  openPreview: Dispatch<SetStateAction<boolean>>;
}

export default function Modal(props: Props) {
  return (
    <div id="my-modal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <span className="close" onClick={() => props.openPreview(false)}>
            &times;
          </span>
        </div>
        <div className="modal-body">
          <div className="video-container">
            {props.selectedFile.isImage ? (
              <img
                src={props.selectedFile.file as string}
                alt=""
                className=""
              />
            ) : (
              <video
                controls={true}
                src={props.selectedFile.file as string}
              ></video>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
