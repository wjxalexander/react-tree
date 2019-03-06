
function getDataStructure(data) {
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
        list[i].parent = null;
      }
      for (let i = 0; i < list.length; i += 1) {
        let node = list[i]; //单独取出
        //说明他有爸爸
        // if you have dangling branches check that map[node.parentId] exists
        if(node.parentId !== 0){
          list[map[node.parentId]].children.push(node)
          list[map[node.parentId]].isHalfSelected = false
          node.parent = list[map[node.parentId]]
        }else{
          roots.push(node);
        }
      }
      return roots;
    }
    return list_to_tree(data);
  }
  
  export {getDataStructure}