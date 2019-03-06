import React, { Component,Fragment } from "react";
import {getDataStructure} from './dataFactory'
import data from "./data.json";
import styles from "./styles.scss"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: data,
      treeData: null
    };
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  generateTree(data) {
    return (data.map((item,index)=>{ 
      if (item.children.length === 0) {
        return (
          <Fragment key={`${item.moduleName}-${index}`}>
            <li>
              <span className={ item.checkState ? "inputwrapper inputwrapper-active" : "inputwrapper"}onClick={()=>{this.handleClick(item,index)}}>
                 <input type="checkbox" checked= {item.checkState} style={{display:"none"}}></input>
              </span>
              <span>{item.moduleName}</span>
          </li>
          </Fragment>
        )
      } else {
        return (
          <Fragment key={index}>
          <li>
              <span className="switch-open" onClick={()=>{this.toggle(data,index)}}></span>
              {/* 以下是父节点的checkbox */}
              <span className={item.checkState ? 
              "inputwrapper inputwrapper-active" 
              : (!item.checkState && !item.isHalfSelected ? "inputwrapper" : "inputwrapper inputwrapper-halfselect")} 
              onClick={()=>{this.handleClick(item,index)}}>
                <input type="checkbox" checked= {item.checkState} style={{display:"none"}}></input>
              </span>
              <span >{item.moduleName}</span>
              {item.show ? <ul>{this.generateTree(item.children)}</ul> :null}
          </li>
          </Fragment>
        );
      }
    }))
  }

  toggle = (data,index)=>{
    data[index].show = !data[index].show
    this.setState({treeData: this.state.treeData})
  }

  handleChildrenState(item,state,e){
    item.forEach(element => {
      element.checkState =state;
      element.children.length===0 ? element.checkState = state : this.handleChildrenState(element.children,state);
    });
  }
  monitorChildrenState(item){
    let parent = item.parent
    if(item.checkState===true){
      //儿子为true时的控制
      while(parent){
        parent.checkState = parent.children.every(ele=>ele.checkState===true)
        parent.isHalfSelected = parent.children.some(ele=>!ele.checkState) ? true : false
        parent = parent.parent
      }
    }else{
      while(parent){
          parent.checkState = false;
          parent.isHalfSelected = parent.children.some(ele=>ele.checkState)? true : false
          parent = parent.parent
      }
    }
  }
  handleClick(item){
    let {treeData} = this.state
    item.checkState = !item.checkState
    this.handleChildrenState(item.children,item.checkState)
    this.monitorChildrenState(item)
    this.setState({treeData:treeData})
  }

  handleSubmit(){
    let {data,treeData} = this.state
    console.log("treeData:", treeData)
    console.log("data:",data)
  }

  componentWillMount() {
    let treeData = getDataStructure(this.state.data);
    this.setState({ treeData: treeData });
  }
  render() {
    let { treeData } = this.state;
    let ret = this.generateTree(treeData)
    return(
    <div className="App" style={{display:"flex"}}>
      <ul className="container" style={{display:"flex"}}>     
        {ret}
      </ul>
      <div>
        <button onClick={this.handleSubmit}>submit</button>
      </div>
    </div>);
  }
}

export default App;
