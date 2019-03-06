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
  }

  generateTree(data) {
    return (data.map((item,index)=>{ 
      if (item.children.length === 0) {
        return (
          <Fragment key={index}>
            <li>
              <input type="checkbox" checked= {item.checkState} onClick={()=>{this.handleClick(item,index)}}></input>
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
              <input type="checkbox" checked= {item.checkState} onClick={()=>{this.handleClick(item,index)}}></input>
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
      element.checkState =state
      element.children.length===0 ? element.checkState = state : this.handleChildrenState(element.children,state)
    });
  }
  monitorChildrenState(treeData){
    treeData.forEach(item=>{
      if(item.children.length === 0 ){
      return item.checkState
      }else{
         let index = item.children.findIndex((el)=>!el.checkState)
         index < 0 ?  this.monitorChildrenState(item.children) : item.checkState = false 
      }
      console.log(item.moduleName,item.checkState)

    })
  }

  handleClick(item){
    let {treeData} = this.state
    item.checkState = !item.checkState
    this.handleChildrenState(item.children,item.checkState)
    this.monitorChildrenState(treeData)
    this.setState({treeData:treeData})
  }
  componentWillMount() {
    let treeData = getDataStructure(this.state.data);
    this.setState({ treeData: treeData });
  }
  render() {
    let { treeData } = this.state;
    let ret = this.generateTree(treeData)
    return(
    <div className="App">
      <ul className="container" style={{display:"flex"}}>     
        {ret}
      </ul>
    </div>);
  }
}

export default App;
