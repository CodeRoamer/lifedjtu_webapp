Ext.define('LifeDJTU.view.Main', {
    extend: 'Ext.Container',
    xtype: 'main',
    requires : ['Ext.TitleBar'],
    id:'main',
    config:{
        layout:{
            type:'card',
            animation : 'flip'
        },

        items:[
            {
                xtype:'container',
                layout:'vbox',
                items:[
                    {
                        xtype:'titlebar',
                        maxHeight:'20px',
                        flex:1
                    },
                    {
                        xtype:'userpanel',
                        flex:10
                    }
                ]
            },
            {
                xtype:'signinform'
            }
        ]
    }


});
