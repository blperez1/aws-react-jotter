import React, {Fragment} from 'react';
import {Button} from 'react-bootstrap';
import CKEditor from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import { API, Auth } from "aws-amplify";
import queryString from "query-string";


export default class ViewJot extends React.Component {
   constructor(props, match) {
       super(props,match);
       this.state = {
           titledata: "",
           bodydata: "",
           userid: "",
           jotid: "",
           edit: false
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
   editJot = () => {
       this.setState({edit:true})
   }
   saveJot = async event => {
       event.preventDefault();
       let note = {
           title: this.state.titledata,
           body: this.state.bodydata,
           userid: this.state.userid,
           jotid: this.state.jotid
       };
       try {
           let sessionObject = await Auth.currentSession();
           let idToken = sessionObject.idToken.jwtToken;
           await this.saveNote(note,idToken);
           this.props.history.push("/alljots");
       }catch (e) {
           alert(e);
       }
   }
   saveNote(note, idToken) {
       let myInit = {
           headers: { Authorization: idToken},
           body: note
       }
       return API.post("jotter", "/newjot", myInit)
   }

   async componentDidMount(){
       try{
           let sessionObject = await Auth.currentSession();
           let idToken = sessionObject.idToken.jwtToken;
           let jot = await this.getNote(idToken);
           this.setState({
               titledata: jot.title,
               bodydata: jot.body,
               userid: jot.userid,
               jotid: jot.jotid
           });
       }catch(e){
           alert(e);
       }
   }

   getNote(idToken) {
       let params = queryString.parse(this.props.location.search);
       let path = "jot?jotid="+params.jotid+"&userid="+params.userid;
       let myInit = {
           headers: { Authorization: idToken }
       }
       return API.get("jotter", path,myInit);
   }
   render() {
       return (
           <Fragment>
               {!this.state.edit &&
               <div style={{marginTop: "1%", marginLeft: "5%"}}>
                   <Button
                       onClick={this.editJot}
                   >
                       Edit
                   </Button>
               </div>}
               {this.state.edit &&
               <div style={{marginTop: "1%", marginLeft: "5%"}}>
                   <Button
                       onClick={this.saveJot}
                   >
                       Save
                   </Button>
               </div>}
               <div style={{marginTop: "1%", marginLeft: "5%", width: "60%",border: "1px solid #cccc", marginBottom: "1%"}}>
                   <CKEditor
                       data={this.state.titledata}
                       editor={BalloonEditor}
                       disabled={!this.state.edit}
                       onChange={(event, editor) => {
                           this.onTitleChange(event, editor);
                   }}/>
               </div>
               <div style={{marginLeft: "5%", width: "60%",border: "1px solid #cccc"}}>
                   <CKEditor
                       data={this.state.bodydata}
                       editor={BalloonEditor}
                       disabled={!this.state.edit}
                       onChange={(event, editor) => {
                           this.onBodyChange(event, editor);
                   }}/>
               </div>          
           </Fragment>
       );
   }
}