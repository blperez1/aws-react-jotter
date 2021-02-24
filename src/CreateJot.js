import React, {Fragment} from 'react';
import {Button} from 'react-bootstrap';
import CKEditor from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import { API,Auth } from "aws-amplify";
const titlecontent = "Title..";
const bodycontent = "Start writing notes..";

export default class CreateJot extends React.Component {
   constructor(props) {
       super(props);
       this.state = {
           titledata: titlecontent,
           bodydata: bodycontent,
       }
   };
   onTitleChange = (event, editor) => {
       const data = editor.getData();
       this.setState({
           titledata: data
       });
   }
   onBodyChange = (event, editor) => {
       const data = editor.getData();
       this.setState({
           bodydata: data
       });
   }
   validateJot = () =>  {
       return this.state.titledata.length > 0 && this.state.bodydata > 0;
   }
   createNew = async event => {
       event.preventDefault();
       let sessionObject = await Auth.currentSession();
       let idToken = sessionObject.idToken.jwtToken;
       let userid = sessionObject.idToken.payload.sub;
       let note = {
           title: this.state.titledata,
           body: this.state.bodydata,
           userid: userid,
           jotid: this.createJotid()
       };
       try {
           await this.createNote(note,idToken);
           this.props.history.push("/");
       }catch (e) {
           alert(e);
       }
   }
   createNote(note,idToken) {
       let myInit = {
           headers: { Authorization: idToken },
           body: note
       }
       return API.post("jotter", "/newjot", myInit);
   }
   createJotid(){
       let dt = new Date().getTime();
       let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
           let r = (dt + Math.random()*16)%16 | 0;
           dt = Math.floor(dt/16);
           return (c=='x' ? r :(r&0x3|0x8)).toString(16);
       });
       return uuid;
   }
   render() {
       return (
           <Fragment>
               <div style={{marginTop: "1%", marginLeft: "5%"}}>
                   <Button
                       onClick={this.createNew}
                   >
                       Create
                   </Button>
               </div>
               <div style={{marginTop: "1%", marginLeft: "5%", width: "60%",border: "1px solid #cccc", marginBottom: "1%"}}>
                   <CKEditor
                       data={titlecontent}
                       editor={BalloonEditor}
                       onChange={(event, editor) => {
                           this.onTitleChange(event, editor);
                   }}/>
               </div>
               <div style={{marginLeft: "5%", width: "60%",border: "1px solid #cccc"}}>
                   <CKEditor
                       data={bodycontent}
                       editor={BalloonEditor}
                       onChange={(event, editor) => {
                           this.onBodyChange(event, editor);
                   }}/>
               </div>          
           </Fragment>
       );
   }
}