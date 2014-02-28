/**
 * Created by apple on 12/23/13.
 */
Ext.define('LifeDJTU.view.HomePanel',{
    extend:'Ext.Panel',
    xtype:'homepanel',

    requires:[
        'Ext.TitleBar'
    ],

    config:{
        layout:{
            type:'vbox',
            patch:'center',
            align:'stretch'
        },
        defaults:{
            xtype:'panel',
            flex:3
        },
        items :[
            {
                xtype:'titlebar',
                docked:'top',
                title:'你好，李赫(1018110323)',
                style:'background:#5b5b5b'
            },
            {
                layout:{
                    type:'hbox'
                },
                defaults:{
                    flex:1,
                    xtype:'panel',
                    styleHtmlContent:true
                },
                items:[
                    {
                        xtype:'panel',
                        html:[
                            '<div class="user-panel-box"><br>' +
                                '<h3>第 7 周</h3>' +
                                '<h3>星期三</h3>' +
                                '<p>2013年10月11日</p>'+
                                '</div>'
                        ].join("")
                    },
                    {
                        xtype:'panel',
                        html:[
                            '<div class="user-panel-box"><br>' +
                                '<h3>27°C</h3>' +
                                '<h3>多云转中雨</h3>' +
                                '<p>微风 3-4 级</p>'+
                                '</div>'
                        ].join("")                    }
                ]
            },
            {
                layout:{
                    type:'hbox'
                },
                defaults:{
                    flex:1,
                    xtype:'panel',
                    styleHtmlContent:true
                },
                items:[
                    {
                        xtype:'panel',
                        html:[
                            '<div class="user-panel-box"><br>' +
                                '<h4>局域网技术与组网工程</h4>' +
                                '<h3>9406</h3>' +
                                '<h3>下午3,4节</h3>'+
                                '</div>'
                        ].join("")
                    },
                    {
                        xtype:'panel',
                        html:[
                            '<div class="user-panel-box"><br>' +
                                '<h4>高级英语</h4>' +
                                '<h3>J232</h3>' +
                                '<p>2013年10月11日</p>' +
                                '<p>13:50 - 15:50</p>'+
                                '</div>'
                        ].join("")
                    }
                ]
            },
            {
                flex:1
            },
            {
                flex:1,
                layout:{
                    type:'hbox'
                },
                items :[
                    {
                        xtype:'spacer',
                        flex:1
                    },
                    {
                        xtype:'button',
                        ui:'round',
                        text:'一键查询空教室',
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