// $.getJSON(url, data, func)
// 发送一个 GET 请求给 url ，其中 data 对象的内容将以查询参数的形式发送。
// 一旦数据抵达，它将以返回值作为参数执行给定的函数。

// 提交词条数据
$(document).ready(function() {
  $('input#entry_form').bind('click', function() {
    // 绑定id为entry_form的button。点击后，发送表单数据，并取得json结果，然后操作dom
    var original = $('input[name="original"]').val();
    var translation = $('input[name="translation"]').val();
    $.getJSON($SCRIPT_ROOT + '/entry_submit', {
      'original': original,
      'translation': translation
    }, function(data) {
      if(data.result === true) {
        $("#entry_submitted_result").text("添加成功！");
      } else {
        $("#entry_submitted_result").text("添加失败！");
      }
      // 添加这条新的词条到词条列表中
      //
      var one_entry = $('<div class="one_entry">' +
        '<div class="original">' + original + '</div>' +
        '<div class="translation">' + translation + '</div>' +
        '<a href="#" class="delete_this_entry">删除<a>' +
        '</div>'
      );
      one_entry.find('.delete_this_entry').click(function(){
        var that = this;
        var original = $(this).parent().find('.original')[0].textContent;
        $.getJSON($SCRIPT_ROOT + '/entry_delete', {
          'original' : original
        }, function(data) {
          $(that).parent().remove();
        });
      });
      one_entry.prependTo('div#entries');
    });
    return false;
  });
});

// 获取所有的词条数据,并操作dom展示
$(document).ready(function() {
  $.getJSON($SCRIPT_ROOT + '/entries_get', display_entries);
});



// 刷新词条列表
var refresh_entries_list = function() {
  $('div.one_entry').remove();
  $.getJSON($SCRIPT_ROOT + '/entries_get', display_entries);
};

// 操作DOM展示词条列表。供调用
var display_entries = function(data) {
  for(var i = 0; i < data.entries.length; i++) {
    // 对于 data 中每个词条，循环遍历

    // 创建 one_entry 为每个词条书写 html，并添加删除与修改按钮
    var one_entry = $('<div class="one_entry">' +
      '<div class="original">' + data.entries[i].original + '</div>' +
      '<div class="translation">' + data.entries[i].translation + '</div>' +
      '<a href="#" class="delete_this_entry">删除<a>' +
      '<a href="#" class="update_this_entry">修改<a>' +
      '</div>'
    );
    // 为每个删除按钮绑定事件，当点击时，发送请求到服务器，内容为要删除的词条的 original
    one_entry.find('.delete_this_entry').click(function(){
      var that = this;
      var original = $(this).parent().find('.original')[0].textContent;
      $.getJSON($SCRIPT_ROOT + '/entry_delete', {
        'original' : original
      }, function(data) {
        $(that).parent().remove();
      });
    });

    // 为每个修改按钮绑定事件，当点击时， 发送请求到服务器，内容为原 original 和修改后的内容
    one_entry.find('.update_this_entry').click(function() {
      // 点击修改按钮
      // 创建 update_form 修改框
      var update_form = $(
        '<form method="post" name="update_entry">' +
          '<div>' +
            '<label for="">original</label>' +
            '<input type="text" name="original_updated">' +
          '</div>' +
          '<div>' +
            '<label for="">translation</label>' +
            '<input type="text" name="translation_updated">' +
          '</div>' +
          '<input id="update_entry_form" class="" type="button" value="Post!">' +
        '</form>'
      );
      // 取得被修改的词条的 original
      var original = $(this).parent().find('.original')[0].textContent;
      var this_entry = $(this).parent();
      // 点击提交按钮
      update_form.find('input#update_entry_form').click(function() {
        var that = this;  // 用在回调函数中, 这里的this 指代 update_entry_form这个按钮
        var original_updated = $('input[name="original_updated"]').val();
        var translation_updated = $('input[name="translation_updated"]').val();
        $.getJSON($SCRIPT_ROOT + '/entry_update', {
          'original' : original,
          'original_updated': original_updated,
          'translation_updated': translation_updated
        }, function(data) {
          if(data.result === true) {
            $("#entry_submitted_result").text("修改成功！");
          } else {
            $("#entry_submitted_result").text("修改失败！");
          };
          // 修改完成后，要隐藏这个update_form修改框
          $(that).parent().remove();
          refresh_entries_list();
        });
      });
      update_form.appendTo('body');
    });
    one_entry.prependTo('div#entries');
}};


$(document).ready(function() {
  $('input#get_by_original_form').bind('click', function() {
    var original = $('input[name="get_original_input"]').val();
    $.getJSON($SCRIPT_ROOT + '/entry_get_by_original', {
      'original': original
    }, function(data) {
      if(data.entries) {
        $("#entry_submitted_result").text("查询成功！结果如下");
      } else {
        $("#entry_submitted_result").text("查找失败！");
      }
      // 添加这条新的词条到词条列表中
      //
      var one_entry = $('<div class="one_entry">' +
        '<div class="original">' + original + '</div>' +
        '<div class="translation">' + data.entries.translation + '</div>' +
        '</div>'
      );
      one_entry.appendTo('div.display_search_info');
    });
    return false;
  });
});
