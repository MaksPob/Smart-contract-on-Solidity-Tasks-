pragma solidity ^0.4.17;

contract Todo {
        
        struct Todo {
            string task;
            string description;
            uint256 timeStart;
            uint256 timeEnd;
        }
        
    Todo[] list;
    
    function setList(string newList, string newDescription, uint256 start, uint256 end) public {       // добавить задачу
        Todo memory t = Todo(newList, newDescription, start, end);
        list.push(t);
    }
    
    function getList(string newList) public constant returns(string task, string description, uint256 timeStart, uint256 timeEnd) {   // получить список задач
        for(uint i = 0; i < list.length; i++) {
            if(keccak256(newList) == keccak256(list[i].task)) {
                return (list[i].task, list[i].description, list[i].timeStart, list[i].timeEnd);
            }
        }
    }
    
    function deleteListByTime() public {            // удаляем таски по времени, срок которых истек 
        for (uint i = 0; i < list.length; i++) {
            if (now > list[i].timeEnd) {
                delete list[i];
            } 
        }
    }
    
    function deleteListBySelect(string newList) public {           // удаляем по выбору
        for(uint i = 0; i < list.length; i++) {
            if(keccak256(newList) == keccak256(list[i].task)) {
                delete list[i];
            }    
        }
    }
    
    function changeList(string newList, string newDescription, uint256 timeStart, uint256 timeEnd) public {    // изменить запись
        for(uint i = 0; i < list.length; i++) {
            if(keccak256(newList) == keccak256(list[i].task)) {
                delete list[i];
                setList(newList, newDescription, timeStart, timeEnd);
                return;
            }
           
        }
    }
    
   
}