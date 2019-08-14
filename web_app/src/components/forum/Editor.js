import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {database,storage} from "../../firebase/firebase";
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'
import { Button } from 'antd';




class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "",
            edit:"",
            init: props.init,
        }
    }

    handleChange = (content) => {
        console.log("content");
        this.setState({edit: content})
        console.log(content)
    }

    handlesubmit = (event) =>{
        event.preventDefault();

        database.ref('display').set({
            content: this.state.edit
        });
        this.editorInstance.clear();

    }


    handleRawChange = (rawContent) => {
        console.log("raw");
        console.log(rawContent)
    }

    validateFn = (file) => {
        return file.size < 1024 * 10240
        // The maximum size of file must be no larger than 10MB.
    }

    uploadFn = (param) => {
        // Create a root reference
        let storageRef = storage.ref("test01");
        // Create a reference to 'the file'
        let mountainsRef = storageRef.child(param.file.name);
        let file = param.file; // use the Blob or File API
        let uploadtask = mountainsRef.put(file);
        uploadtask.on('state_changed',
            function progress(snapshot){
                param.progress(snapshot.bytesTransferred / snapshot.totalBytes * 100);
            },function error(err){
                param.error({
                    msg: 'unable to upload.'
                })
            },function (){
                uploadtask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    console.log('File available at', downloadURL);
                    param.success({
                        url: downloadURL,
                        meta: {
                            id: 'xxx',
                            title: 'xxx',
                            alt: 'xxx',
                            loop: true, //video loop available
                            autoPlay: false, // video autoplay
                            controls: true, // video control bars available
                            poster: 'http://xxx/xx.png', // cover of the media player
                        }
                    })
                });
            });


    }

    componentDidMount(){
        let postRef = database.ref("display/")

        postRef.child('content').on('value',(snapshot) => {
            const content = snapshot.val();
            this.setState({content});
        })

    }

    render(){
        const editorProps = {
            height: 500,
            contentFormat: 'html',
            initialContent: this.props.init,
            onChange: this.handleChange,
            onRawChange: this.handleRawChange,
            media: {
                allowPasteImage: true,
                validateFn: this.validateFn,
                uploadFn: this.uploadFn,
            },
            language: "en",
        }

        return(
            <div>
                <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
                <div className="demo">
                    <BraftEditor ref={instance => this.editorInstance = instance}{...editorProps}/>
                </div>
                <Button type='primary' onClick={this.handlesubmit}>Submit</Button>
            </div>

        )
    }
}

export default (props)=><Editor {...props} key={props.location.pathname} />