/**
 * Created by apple on 12/22/13.
 */
Ext.define('LifeDJTU.view.UserMenu', {
    extend:'Ext.Menu',
    xtype:'usermenu',

    config:{
        defaults:{
            ui:'confirm-round'
        },
        items: [
            {
                xtype:'panel',
                styleHtmlContent:true,
                html:"<h1 style='color: #f5f5f5'>人在交大</h1>"
            },
            {
                text:'主页',
                iconCls:'home',
                id:'menu_0'
            },
            {
                text: '修改密码',
                iconCls: 'settings',
                id:'menu_1'
            },
            {
                text: '查询教室',
                iconCls: 'compose',
                id:'menu_2'
            },
            {
                text: '我的学籍信息',
                iconCls: 'star',
                id:'menu_3'
            },
            {
                text: '我的课程表',
                iconCls: 'reply',
                id:'menu_4'
            },
            {
                text: '我的考试',
                iconCls: 'search',
                id:'menu_5'
            },
            {
                text: '我的成绩',
                iconCls: 'locate',
                id:'menu_6'
            }
        ]
    }


});