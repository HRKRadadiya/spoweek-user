import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { API } from "../config/API/api.config";
import FroalaEditor from "react-froala-wysiwyg";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const MessageCKEditor = (props) => {
    const { t } = useTranslation();
    const [image, setImage] = useState("")
    const [video, setVideo] = useState("")
    const [videoSize, setVideoSize] = useState(0)
    const [imageSize, setImageSize] = useState(0)
    const [wordCount, setWordCount] = useState(0)
    const [totalChars, setTotalChars] = useState(0)

    useEffect(() => {
        setImageSize(0)
        setVideoSize(0)
        setImage("")
        setVideo("")
        CharAndWordCount()
    }, [])

    const CharAndWordCount = () => {
        const data = props.data;
            var regex = /\s+/gi;
            const strippedString = data.replace(/(<([^>]+)>)/gi, "");
            var wordCount = strippedString.trim().replace(regex, ' ').split(' ').length;
            var totalChars = strippedString.length;
            setWordCount(wordCount)
            setTotalChars(totalChars)
    }

    const handleChange = (event, editor) => {
        if (props?.type === "memorialPost") {
            props.onChange(event, image, video, imageSize, videoSize);
        } else {
            const data = editor.getData();
            var regex = /\s+/gi;
            const strippedString = data.replace(/(<([^>]+)>)/gi, "");
            var wordCount = strippedString.trim().replace(regex, ' ').split(' ').length;
            var totalChars = strippedString.length;
            setWordCount(wordCount)
            setTotalChars(totalChars)
            props.onChange(data);
        }
    };

    return (
        <>
            {props?.type === "memorialPost" ?

                <FroalaEditor
                    tag='textarea'
                    model={props.data}
                    onModelChange={handleChange}
                    config={{
                        placeholderText: `${t("MemorialPost.Enter_text")}`,
                        language: 'ko',
                        videoResponsive: true,
                        toolbarButtons: ['insertImage', 'insertVideo'],
                        imageEditButtons: ['imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove'],
                        imageUploadURL: `${API.endpoint}/memorialHall/memorialHallPostImage?post_type=Album&memorial_id=${props?.hallData?.id}&user_id=${props?.userData?.id}&lang=ko`,
                        imageMaxSize: `${props?.userData?.MaxPicturesSize}` * 1024 * 1024,

                        videoUploadURL: `${API.endpoint}/memorialHall/memorialHallPostImage?post_type=Video&memorial_id=${props?.hallData?.id}&user_id=${props?.userData?.id}&lang=ko`,
                        videoMaxSize: `${props?.userData?.MaxVideoSize}` * 1024 * 1024,

                        events: {
                            'video.uploaded': function (response) {
                                let newResponse = JSON.parse(response)
                                // Return false if you want to stop the video upload.
                                setVideo(newResponse?.link)
                                setVideoSize((newResponse?.file_size)?.toFixed(2))
                                setImageSize(0)
                                setImage("")

                            },
                            'video.error': function (error, response) {
                                let newResponse = JSON.parse(response)
                                // Bad link.
                                if (error.code === 1) {

                                }
                                // No link in upload response.
                                else if (error.code === 2) {
                                    if (newResponse?.message === "Memorial Post Video save Max limit execute") {
                                        let x = document.getElementsByClassName('fr-message')
                                        x[0].innerHTML = `${t("MemorialPost.Memorial_Post_Video_save_Max_limit_exceeds")}` 
                                    }
                                }
                                // Error during video upload.
                                else if (error.code === 3) {
                                    let x = document.getElementsByClassName('fr-message')
                                    x[0].innerHTML = `${t("MemorialPost.Something_Went_Wrong")}`
                                }
                                // Parsing response failed.
                                else if (error.code === 4) {

                                }
                                // Video too text-large.
                                else if (error.code === 5) {
                                    let x = document.getElementsByClassName('fr-message')
                                    x[0].innerHTML = `${t("MemorialPost.Maximum_size_of_video_is_100MB")}`
                                }
                                // Invalid video type.
                                else if (error.code === 6) {
                                    let x = document.getElementsByClassName('fr-message')
                                    x[0].innerHTML = `${t("MemorialPost.Invalid_video_type")}`
                                }
                                // Video can be uploaded only to same domain in IE 8 and IE 9.
                                else if (error.code === 7) {

                                }
                            },
                            'image.uploaded': function (response) {
                                let newResponse = JSON.parse(response)
                                // Return false if you want to stop the video upload.
                                setImage(newResponse?.link)
                                setImageSize((newResponse?.file_size)?.toFixed(2))
                                setVideoSize(0)
                                setVideo("")

                            },
                            'image.error': function (error, response) {
                                let newResponse = JSON.parse(response)
                                // Bad link.
                                if (error.code === 1) {

                                }
                                // No link in upload response.
                                else if (error.code === 2) {
                                    if (newResponse?.message === "Memorial Post Image save Max limit execute") {
                                        let x = document.getElementsByClassName('fr-message')
                                        x[0].innerHTML = `${t("MemorialPost.Memorial_Post_Image_save_Max_limit_exceeds")}`
                                    }
                                }
                                // Error during image upload.
                                else if (error.code === 3) {
                                    let x = document.getElementsByClassName('fr-message')
                                    x[0].innerHTML = `${t("MemorialPost.Something_Went_Wrong")}`
                                }
                                // Parsing response failed.
                                else if (error.code === 4) {

                                }
                                // Image too text-large.
                                else if (error.code === 5) {
                                    let x = document.getElementsByClassName('fr-message')
                                    x[0].innerHTML = `${t("MemorialPost.Maximum_size_of_Image_is_10MB")}`
                                }
                                // Invalid image type.
                                else if (error.code === 6) {
                                    let x = document.getElementsByClassName('fr-message')
                                    x[0].innerHTML = `${t("MemorialPost.Invalid_Image_type")}`
                                }
                                // Image can be uploaded only to same domain in IE 8 and IE 9.
                                else if (error.code === 7) {

                                }
                                // Response contains the original server response to the request if available.
                            }
                        }
                        // videoAllowedTypes: ['webm', 'jpg', 'ogg'],
                    }}
                />
                :
                <>
                    <CKEditor
                        editor={ClassicEditor}
                        data={props.data}
                        onChange={handleChange}
                        config={{
                            image: {
                                toolbar: [
                                    'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText', '|',
                                    'toggleImageCaption', 'imageTextAlternative'
                                ],
                            },
                            ckfinder: {
                                uploadUrl: `${API.endpoint}/memorialHall/memorialHallMessageImage?lang=ko`,
                                // Enable the XMLHttpRequest.withCredentials property.
                                withCredentials: true,
                                // Headers sent along with the XMLHttpRequest to the upload server.
                                headers: {
                                    "X-CSRF-TOKEN": "CSFR-Token",
                                    Authorization: "Bearer <JSON Web Token>",
                                },
                            },
                        }}
                    />
                    <div className="word-counter">
                        <p className="mx-2">Words: {wordCount}</p>
                        <p>Characters: {totalChars}</p>
                    </div>
                </>
            }
        </>
    );
};

export default MessageCKEditor;
