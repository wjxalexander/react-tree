import React, { Component,Fragment } from "react";
import data from "./data.json";
import styles from "./styles.scss"
import ReactDOM from 'react-dom';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: data,
      treeData: null
    };
    // this.myRef = React.createRef();
  }
  getDataStructure(data) {
    let copy = data.slice();
    // 给每个对象赋爸爸值
    copy.forEach(item => {
      let number = item.moduleCode.toString().split("");
      let length = number.length;
      for (let i = length - 1; i >= 0; i--) {
        let bit = number[i];
        if (bit !== "0") {
          number[i] = "0";
          break;
        }
      }
      item.parentId = parseInt(number.join(""));
      item.checkState = false;
      item.show = true;
    });
    function list_to_tree(list) {
      let map = {},
        roots = [];
      for (let i = 0; i < list.length; i += 1) {
        map[list[i].moduleCode] = i; // initialize the map,创建映射将每个ID和当前i 映射起来
        list[i].children = []; // initialize the children
      }
      for (let i = 0; i < list.length; i += 1) {
        let node = list[i]; //单独取出
        //说明他有爸爸
        // if you have dangling branches check that map[node.parentId] exists
        node.parentId !== 0
          ? list[map[node.parentId]].children.push(node)
          : roots.push(node);
      }
      return roots;
    }
    return list_to_tree(data);
  }
  generateTree(Data) {
    return (Data.map((item,index)=>{ 
      if (item.children.length === 0) {
        return (
          <Fragment key={index}>
            <li>
              <input type="checkbox" checked= {item.checkState}></input>
              <span>{item.moduleName}</span>
          </li>
          </Fragment>
        )
      } else {
        return (
          <Fragment key={index}>
          <li>
            <span className="switch-open" onClick={()=>{this.toggle(data,index)}}></span>
            <input type="checkbox" checked= {item.checkState}></input>
            <span>{item.moduleName}</span>
            {item.show ? <ul>{ this.generateTree(item.children)}</ul> :null}
          </li>
          </Fragment>
        );
      }
    }))
  }
  toggle = (data,index)=>{
    data[index].show = !data[index]
    this.setState({treeData: this.state.treeData})
  }
  componentWillMount() {
    let treeData = this.getDataStructure(this.state.data);
    this.setState({ treeData: treeData });
  }
  render() {
    let { treeData } = this.state;
    let ret = this.generateTree(treeData)
    return(
    <div className="App">
      <ul className="container">     
        {ret}
      </ul>
    </div>);
  }
}

export default App;
