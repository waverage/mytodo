( function() {
'use strict';
$(document).ready(function () {
    // Прикручиваем виджет календаря к нужным полям
    $('.datepicker').datepicker();

    for(var i = 0; i < $('.btn-remove-task').length; i++)
        $($('.btn-remove-task')[i]).click( btnHandlerRemove );

    for(var i = 0; i < $('.btn-remove-task').length; i++)
        $($('.btn-update-task')[i]).click( btnHandlerUpdate );

    $('#btn-add-task').click( btnHandlerAdd );

});

function btnHandlerAdd(e) {
    var task_text = $('#task_text').val();
    var task_date = $('#task-data').val();
    var genID = generateID();
    //Если поля пустые
    if(!task_text || !task_date) {
        alert('Invalid data');
        return;
    }
    $('#task_text').val('');
    $('#task-data').val('');

    function successAjax(res) {
        var one_tr = document.createElement('tr');
        one_tr.id = genID.toString();

        var btn_del = elt('button',
                          {class:'btn-remove-task glyphicon glyphicon-remove',
                           title:'Удалить'});
        $(btn_del).click(btnHandlerRemove);
        var btn_upd = elt('button',
                          {class:'btn-update-task glyphicon glyphicon-pencil',
                           title:'Редактировать'});
        $(btn_upd).click(btnHandlerUpdate);

        // Эта нехитрая конструкция обертывает новую задачу в рядок
        // И добавляет в таблицу
        $('#add-row').before(elt('tr', {id: genID.toString()},
                                elt('td', {class: 'td-control'}, btn_del),
                                elt('td', {class: 'td-control'}, btn_upd),
                                elt('td', {
                                            class: 'item-text',
                                            inside: task_text,
                                            spellcheck: 'false'}),
                                elt('td', {class:'item-date'},
                                    elt('input',
                                        {
                                            type: 'text',
                                            value: task_date,
                                            disabled: 'disabled',
                                            class: 'datepicker newdatapicker'
                                        }
                                        )
                                    )
                                )
                            );
        $('.newdatapicker').datepicker();
    }

    $.ajax({
        url:'http://localhost:3000/add',
        method: 'POST',
        data: {
            id: genID,
            text: task_text,
            date: task_date
        },
        success: successAjax
    });
}

function btnHandlerRemove(e) {
    var task_id = $(e.target)
                    .parent()
                    .parent()
                    .attr('id');
    $.ajax({
        url:'http://localhost:3000/del',
        method: 'POST',
        data: {id:task_id},
        success: function () {}
    });
    $('#' + task_id).remove();
}

function btnHandlerUpdate(e) {
    var task_row = $(e.target).parent().parent();
    var text_field = $(task_row).find('.item-text');
    var date_field = $(task_row).find('.item-date');
    var btn_upd = $(task_row).find('.btn-update-task');

    task_row.addClass('success');

    $(btn_upd).removeClass('glyphicon-pencil');
    $(btn_upd).addClass('glyphicon-floppy-disk');
    $(btn_upd).css('background', '#dff0d8');
    $(task_row)
        .find('.btn-remove-task')
        .css('background', '#dff0d8');

    $(text_field).attr('contenteditable', 'true');
    $(date_field)
        .find('input')
        .removeAttr('disabled');
    $(date_field)
        .find('input')
        .datepicker();

    $(btn_upd).unbind( 'click' );
    $(btn_upd).click(btnHandlerSave);
}

function btnHandlerSave(e) {
    var task_row = $(e.target)
                        .parent()
                        .parent();
    var text_field = $(task_row).find('.item-text');
    var date_field = $(task_row).find('.item-date input');
    var btn_upd = $(task_row).find('.btn-update-task');

    $(task_row).removeClass('success');
    $(btn_upd).css('background', '#fff');
    $(task_row)
        .find('.btn-remove-task')
        .css('background', '#fff');

    $(text_field).attr('contenteditable', 'false');
    $(date_field).attr('disabled', '');

    $(btn_upd).unbind( 'click' );
    $(btn_upd).removeClass('glyphicon-floppy-disk');
    $(btn_upd).addClass('glyphicon-pencil');
    $(btn_upd).click(btnHandlerUpdate);

    $.ajax({
        url: 'http://localhost:3000/update',
        method: 'POST',
        data: {
            id: $(task_row).attr('id'),
            text: $(text_field).text(),
            date: $(date_field).val()
        },
        success: function ( res ) {}
    });
}

function generateID () {
    return Math.round( ( Math.random() * 10000000 ) * 100 / 96);
}

// Создает новый DOM елемент с указаными атрибутами,
// Может принимать больше атрибутов(ожидается что ето будут DOM елементы),
// тогда они вставляются всередину создаваемого елемента
function elt( name, attributes ) {
    var node = document.createElement( name );
    if ( attributes ) {
        for ( var attr in attributes )
            if ( attributes.hasOwnProperty( attr ) ) {
                if( attr == 'inside' ) {
                    node.innerHTML = attributes[ attr ];
                } else
                    node.setAttribute( attr, attributes[ attr ] );
            }
    }
    for ( var i = 2; i < arguments.length; i++ ) {
        var child = arguments[ i ];
        if ( typeof child == 'string' )
            child = document.createElement( child );
        node.appendChild( child );
    }
    return node;
}
} )();