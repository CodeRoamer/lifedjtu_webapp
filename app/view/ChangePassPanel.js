/**
 * Created by apple on 12/23/13.
 */
Ext.define('LifeDJTU.view.ChangePassPanel',{
    extend:'Ext.Panel',
    xtype:'changepasspanel',

    requires: [
        'Ext.form.FieldSet',
        'Ext.field.Password'
    ],

    config:{
        layout:{
            type:'vbox'
        },

        items : [
            {
                xtype: 'fieldset',
                title: '原密码',
                defaults: {
                    labelWidth: '35%'
                },
                items: [
                    {
                        xtype      : 'passwordfield',
                        name       : 'password',
                        label      : '原密码',
                        placeHolder: '请输入原有密码',
                        required      : true,
                        clearIcon  : true
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: '新密码',
                defaults: {
                    labelWidth: '35%'
                },
                items: [
                    {
                        xtype      : 'passwordfield',
                        name       : 'password',
                        label      : '新密码',
                        placeHolder: '请输入新设密码',
                        required      : true,
                        clearIcon  : true
                    },
                    {
                        xtype      : 'passwordfield',
                        name       : 'password',
                        label      : '确认密码',
                        placeHolder: '请重新输入新设密码',
                        required      : true,
                        clearIcon  : true
                    }
                ]
            },
            {
                xtype:'panel',
                layout:{
                    type:'hbox',
                    align:'center',
                    patch:'center'
                },
                items: [
                    {
                        xtype:'spacer',
                        flex:1
                    },
                    {
                        xtype:'button',
                        ui:'confirm-round',
                        text:'确认更改',
                        flex:3
                    },
                    {
                        xtype:'spacer',
                        flex:1
                    },
                    {
                        xtype:'button',
                        ui:'round',
                        text:'重置输入',
                        flex:3
                    },
                    {
                        xtype:'spacer',
                        flex:1
                    }
                ]
            }
        ]
    }

});