/**
 * Created by apple on 12/22/13.
 */
Ext.define('LifeDJTU.view.SigninForm',{
    extend: 'Ext.form.Panel',

    xtype: 'signinform',

    requires: [
        'Ext.form.FieldSet',
        'Ext.field.Number',
        'Ext.field.Password'
    ],

    config: {

        layout:{
            type:'vbox',
            align:'stretch'
        },

        items: [

            {
                xtype: 'fieldset',
                title: '人在交大 登陆',
                instructions: '请输入学号与密码登陆。',
                defaults: {
                    labelWidth: '35%'
                },
                items: [
                    {
                        xtype         : 'numberfield',
                        name          : 'studentId',
                        label         : '学号',
                        placeHolder   : '请输入10位学号',
                        required      : true,
                        clearIcon     : true
                    },
                    {
                        xtype      : 'passwordfield',
                        name       : 'password',
                        label      : '密码',
                        placeHolder: '请输入教务在线密码',
                        required      : true,
                        clearIcon  : true
                    }
                ]
            },
            {
                xtype:'panel',
                layout:'hbox',
                items :[
                    {
                        xtype:'spacer',
                        flex:1
                    },
                    {
                        xtype:'button',
                        ui:'action-round',
                        text:'登陆',
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
})