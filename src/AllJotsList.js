import React from 'react';
import {Button} from 'react-bootstrap';
import {API, Auth} from 'aws-amplify';
import { Link } from "react-router-dom";

export default class AllJotsList extends React.Component{
   constructor(props) {
       super(props);
       this.state = {
           jotlist: []
       }
   }
   handleDelete = async (index) => {
       let djot = this.state.jotlist[index];
       let sessionObject = await Auth.currentSession();
       let idToken = sessionObject.idToken.jwtToken;
       let userid = sessionObject.idToken.payload.sub;
       try {
           const status = await this.DeleteNote(djot.jotid,userid,idToken);
           const jotlist = await this.jots(userid,idToken);
           this.setState({ jotlist });
       } catch (e) {
           alert(e);
       }
   }

   DeleteNote(jotid,userid,idToken) {
       let path = "jot?jotid="+jotid+"&userid="+userid;
       let myInit = {
           headers: { Authorization: idToken }
       }
       return API.del("jotter", path,myInit);
   }

   handleEdit = async (index) => {
       let jotlist = this.state.jotlist;
       let sessionObject = await Auth.currentSession();
       let idToken = sessionObject.idToken.jwtToken;
       let userid = sessionObject.idToken.payload.sub;
       let path = "/view?jotid="+jotlist[index].jotid+"&userid="+userid;
       this.props.history.push(path);
   }

   async componentDidMount() {
       if (!this.props.isAuthenticated) {
           return;
       }
       try {
           let sessionObject = await Auth.currentSession();
           let idToken = sessionObject.idToken.jwtToken;
           let userid = sessionObject.idToken.payload.sub;
           const jotlist = await this.jots(userid,idToken);
           this.setState({ jotlist });
       } catch (e) {
           alert(e);
       }
   }

   jots(userid,idToken) {
       let path = "/alljots?userid="+userid;
       let myInit = {
           headers: { Authorization: idToken }
       }
       return API.get("jotter", path, myInit);
   }

   render(){
       if(this.state.jotlist == 0)
           return(<h2>Please <Link to="/newjot">add jots</Link> to view.</h2>)
       else
           return(
               <div className="col-md-6">
               <table style={{"marginTop":"2%"}} className="table table-hover">
                   <thead>
                       <tr>
                           <th scope="col">#</th>
                           {/* <th scope="col">Last modified</th> */}
                           <th scope="col">Title</th>
                           <th scope="col">Options</th>
                       </tr>
                   </thead>
                   <tbody>
                           {
                           this.state.jotlist.map((jot, index) => {
                           return(
                               <tr key={index}>
                                       <td>{index+1}</td>
                                       {/* <td>{jot.lastmodified}</td> */}
                                       <td>{jot.title}</td>
                                       <td>
                                               <Button variant="outline-info" size="sm"
                                                   type="button"
                                                   onClick={()=>this.handleEdit(index)}
                                                   >Edit
                                               </Button>
                                           {" | "}
                                           <Button variant="outline-danger" size="sm"
                                               type="button"
                                               onClick={()=>this.handleDelete(index)}
                                               >Delete
                                           </Button>
                                       </td>
                               </tr>
                           )})
                           }
                       </tbody>

               </table>
               </div>   
           );
   }
}