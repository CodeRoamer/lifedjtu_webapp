/**
 * Created by apple on 12/23/13.
 */
Ext.define('LifeDJTU.view.QueryRoomPanel',{
    extend:'Ext.TabPanel',
    xtype:'queryroompanel',

    requires: [
        'Ext.form.FieldSet',
        'Ext.field.Select'
    ],

    config:{
        tabBarPosition: 'bottom',

        items : [
            {
                title: '按日期查询',
                iconCls: 'star',
                layout:{
                    type:'vbox'
                },

                items:[
                    {
                        xtype: 'fieldset',
                        title: '校区与教学楼',
                        defaults: {
                            labelWidth: '35%'
                        },
                        items: [
                            {
                                xtype      : 'selectfield',
                                name       : 'aid',
                                label      : '校区',
                                placeHolder: '选择校区',
                                required      : true,
                                options: [
                                    {text: '旅顺口校区',  value: '1'},
                                    {text: '本部校区', value: '2'}
                                ]
                            },
                            {
                                xtype      : 'selectfield',
                                name       : 'buildingid',
                                label      : '教学楼',
                                placeHolder: '选择教学楼',
                                required      : true,
                                options: [
                                    {text: '教学楼',  value: '1'},
                                    {text: '艺术楼', value: '2'}
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        title: '日期',
                        defaults: {
                            labelWidth: '35%'
                        },
                        items: [
                            {
                                xtype      : 'selectfield',
                                name       : 'week',
                                label      : '第几周',
                                placeHolder: '选择学期周',
                                required      : true,
                                options: [
                                    {text: '第一周',  value: '1'},
                                    {text: '第二周', value: '2'}
                                ]
                            },
                            {
                                xtype      : 'selectfield',
                                name       : 'whichweek',
                                label      : '周几',
                                placeHolder: '选择星期几',
                                required      : true,
                                options: [
                                    {text: '星期一',  value: '1'},
                                    {text: '星期一', value: '2'}
                                ]
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
                                text:'查询',
                                flex:3
                            },
                            {
                                xtype:'spacer',
                                flex:1
                            },
                            {
                                xtype:'button',
                                ui:'round',
                                text:'重置',
                                flex:3
                            },
                            {
                                xtype:'spacer',
                                flex:1
                            }
                        ]
                    }
                ]
            },
            {
                title: '按教室查询',
                iconCls: 'locate',
                layout:{
                    type:'vbox'
                },

                items:[
                    {
                        xtype: 'fieldset',
                        title: '校区与教学楼',
                        defaults: {
                            labelWidth: '35%'
                        },
                        items: [
                            {
                                xtype      : 'selectfield',
                                name       : 'aid',
                                label      : '校区',
                                placeHolder: '选择校区',
                                required      : true,
                                clearIcon  : true
                            },
                            {
                                xtype      : 'selectfield',
                                name       : 'buildingid',
                                label      : '教学楼',
                                placeHolder: '选择教学楼',
                                required      : true,
                                clearIcon  : true
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        title: '教室',
                        defaults: {
                            labelWidth: '35%'
                        },
                        items: [
                            {
                                xtype      : 'selectfield',
                                name       : 'room',
                                label      : '教室',
                                placeHolder: '选择一个教室',
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
                                text:'查询',
                                flex:3
                            },
                            {
                                xtype:'spacer',
                                flex:1
                            },
                            {
                                xtype:'button',
                                ui:'round',
                                text:'重置',
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

        ]
    }

});