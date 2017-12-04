App = {
  web3Provider: null,
  contracts: {},

  initWeb3: function() {
        // Is there is an injected web3 instance?
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
      } else {
        // If no injected web3 instance is detected, fallback to the TestRPC
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      }
      web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('/build/contracts/Todo.json', function(data) {  
      var TodoArtifact = data;
      App.contracts.Todo = TruffleContract(TodoArtifact);
      App.contracts.Todo.setProvider(App.web3Provider);
      return App.initTodo();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-getList', App.getListTodo);  
    $(document).on('click', '.btn-setList', App.setListTodo);
    $(document).on('click', '.btn-deleteByTime', App.deleteByTimeTodo);
    $(document).on('click', '.btn-deleteBySelected', App.deleteBySelectedTodo);
    $(document).on('click', '.btn-changeList', App.changeListTodo);
  },

  initTodo: function() {
    var TodoInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Todo.deployed().then(function(instance) {
        TodoInstance = instance;
        console.log('Success');
      }).catch(function(err) {
        console.log(err.message);
      });
    });  
  },

  getListTodo: function(list, account) {   
      var TodoInstance;
      var fieldWithText = document.querySelector(".fieldWithText");
      App.contracts.Todo.deployed().then(function(instance) {
        TodoInstance = instance;
        var fieldValue = fieldWithText.value;
        var arr = fieldValue.split(',');
        var arr3 = Number(arr[2]);
        var arr4 = Number(arr[3]);
        return TodoInstance.getList(arr[0]); 
      }).then(function(list) {
        console.log(list); 
        App.addInDOM(list);
      }).catch(function(err) {
        console.log(err.message);
      });
  },

  setListTodo: function(list, account) {    
    var TodoInstance;
    var fieldWithText = document.querySelector(".fieldWithText");
    App.contracts.Todo.deployed().then(function(instance) {
      TodoInstance = instance;
      var fieldValue = fieldWithText.value;
      var arr = fieldValue.split(',');
      var arr3 = Number(arr[2]);
      var arr4 = Number(arr[3]);
      return TodoInstance.setList(arr[0], arr[1], arr3, arr4); 
    }).then(function(list) {
      console.log(list);
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  deleteByTimeTodo: function(list, account) {
    var TodoInstance;
    var fieldWithText = document.querySelector(".fieldWithText");
    App.contracts.Todo.deployed().then(function(instance) {
      TodoInstance = instance;
      var fieldValue = fieldWithText.value;
      fieldValue = '';
      return TodoInstance.deleteListByTime(); 
    }).then(function(list) {
      console.log(list); 
      App.addInDOM(list);
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  deleteBySelectedTodo: function(list, account) {
    var TodoInstance;
    var fieldWithText = document.querySelector(".fieldWithText");
    App.contracts.Todo.deployed().then(function(instance) {
      TodoInstance = instance;
      var fieldValue = fieldWithText.value;
      var arr = fieldValue.split(',');
      return TodoInstance.deleteListBySelect(arr[0]); 
    }).then(function(list) {
      console.log(list);
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  changeListTodo: function(list, account) {
    var TodoInstance;
    var fieldWithText = document.querySelector(".fieldWithText");
    App.contracts.Todo.deployed().then(function(instance) {
      TodoInstance = instance;
      var fieldValue = fieldWithText.value;
      var arr = fieldValue.split(',');
      var arr3 = Number(arr[2]);
      var arr4 = Number(arr[3]);
      return TodoInstance.changeList(arr[0], arr[1], arr3, arr4); 
    }).then(function(list) {
      console.log(list); 
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  addInDOM: function(list) {
    if ( list[0] === "" ) {
      var insertTask = document.querySelector(".insertTask");
      var newDiv = document.createElement('div');
      newDiv.style.backgroundColor = "#e7d4ad";
      var newP = document.createElement('p');
      newP.innerHTML = "Такой задачи нет!";
      newDiv.appendChild(newP);
      insertTask.appendChild(newDiv);
    } else {
        var insertTask = document.querySelector(".insertTask");
        var newDiv = document.createElement('div');
        newDiv.style.backgroundColor = "#e7d4ad";
        var newP = document.createElement('p');
        newP.innerHTML = '<br>' + "Задача: " + list[0] + '<br>' + "Описание: " + list[1] + '<br>' +  "Начало выполнения: " + list[2] + '<br>' +  "Время завершения: " + list[3];
        newDiv.appendChild(newP);
        insertTask.appendChild(newDiv);
    }
  }


};

$(function() {
  $(window).load(function() {
    App.initWeb3();
  });
});
