(function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();

var workspaceList;
$(document).ready(function(){

    workspaceList = new Vue({
        el: '#workspaceList',
        data: {
          items: []
        },
        methods: {
            workspaceInfo: function(message, event){
                infoWorkspace(message)
            },
            workspaceOutput: function(name, id, event){
                outputWorkspace(name, id)
            },
            workspaceDestroy: function(message, event){
                destoryWorkspace(message)
            },
            workspaceDelete: function(message, event){
                deleteWorkspace(message)
            }
        }
      })  

    $("#workspaceCreateButton").click(function() {
        inprogressOn()
    });

    $('#goToTFC').click(function() {
        $.ajax({
            url:'/getorg',
            type:'GET',
            success: function(data){
                window.open(`https://app.terraform.io/app/${data}/workspaces`);
            }// end
        });// end ajax
    });

    $("#success-alert").hide();

    refreshWorkspaceList();

    document.getElementById("listTab").onclick = function() { refreshWorkspaceList() };

    var url = new URL(document.URL);
    var result = url.searchParams.get("result");
    console.log(result);
    if(result){
        $("#success-alert").fadeTo(2000, 500).slideUp(500, function() {
            $("#success-alert").slideUp(500);
        });
    }
});

function refreshWorkspaceList() {
    console.log('refreshWorkspaceList')
    $.ajax({
        url:'/list',
        type:'GET',
        dataType: 'json',
        success: function(data){
            workspaceList.items = data
            document.getElementById("workspaceCount").textContent = data.length;
        }// end
    });// end ajax
}

function infoWorkspace(id) {
    console.log('infoWorkspace')
    $.ajax({
        url:`/workspace/info/${id}`,
        type:'GET',
        dataType: 'text',
        error : function(error) {
            console.log(error)
        },
        success : function(data) {
            var jsonData = JSON.parse(data)
            console.log(jsonData.data.attributes)
            document.getElementById("workspaceInfoModalLabel").innerHTML = jsonData.data.attributes.name + " : Info"
            document.getElementById("workspaceInfoModalData").innerHTML = JSON.stringify(jsonData.data, undefined, 2)
            $('#workspaceInfoModal').modal('show')
        },
        complete: function(){
            setTimeout(function(){
                refreshWorkspaceList()
             }, 1000);
        }// end
    });// end ajax
}

function outputWorkspace(name, id) {
    console.log('outputWorkspace')
    $.ajax({
        url:`/output/${id}`,
        type:'GET',
        dataType: 'text',
        error : function(error) {
            console.log(error)
        },
        success : function(data) {
            console.log(data)
            var jsonData = JSON.parse(data)
            console.log(jsonData)
            document.getElementById("workspaceInfoModalLabel").innerHTML = name + " : Outout"
            document.getElementById("workspaceInfoModalData").innerHTML = JSON.stringify(jsonData.included, undefined, 2)
            $('#workspaceInfoModal').modal('show')
        },
        complete: function(){
            setTimeout(function(){
                refreshWorkspaceList()
             }, 1000);
        }// end
    });// end ajax
}

function destoryWorkspace(id) {
    console.log('destoryWorkspace')
    $.ajax({
        url:`/runs/destroy`,
        type:'POST',
        data: {
            id: id
        },
        error : function(error) {
            console.log(error)
        },
        success : function(data) {
            console.log(data)
        },
        complete: function(){
            setTimeout(function(){
                refreshWorkspaceList()
             }, 1000);
        }// end
    });// end ajax
}

function deleteWorkspace(id) {
    console.log('deleteWorkspace')
    $.ajax({
        url:`/workspace/delete/${id}`,
        type:'GET',
        error : function(error) {
            console.log(error)
        },
        success : function(data) {
            console.log(data)
        },
        complete: function(){
            setTimeout(function(){
                refreshWorkspaceList()
             }, 1000);
        }// end
    });// end ajax
}

function inprogressOn() {
    console.log('inprogressOn')
    var workspaceName = document.forms["workspaceCreateForm"]["workspaceName"].value;
    if(workspaceName != ""){
        $('#listTab').trigger('click');
    }
}