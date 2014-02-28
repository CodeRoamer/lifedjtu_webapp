/**
 * Created by apple on 12/22/13.
 */
/**
 * Demonstrates the {@link Ext.Menu} component
 */
Ext.define('LifeDJTU.view.UserPanel', {
    extend: 'Ext.Container',
    requires: [
        'Ext.Toolbar'
    ],

    id:'user-panel',
    xtype:'userpanel',
    config: {

        padding: 20,
        scrollable: null,

        layout:{
            type:'card',
            animation:'slide'
        },

        items: [
            {
                xtype:'toolbar',
                docked:'top',
                title:'主页',
                id:'user-panel-toolbar',
                items:[
                    {
                        text:'菜单',
                        ui:'round',
                        iconCls:'compose',
                        handler: function() {
                            Ext.Viewport.toggleMenu('left');
                        }

                    },{
                        xtype:'spacer'
                    },{
                        text:'登出',
                        handler:function(){
                            Ext.getCmp('main').setActiveItem(1);
                        }
                    }
                ]
            },
            {
                xtype:'homepanel'
            },
            {
                xtype:'changepasspanel'
            },
            {
                xtype:'queryroompanel'
            },
            {
                xtype:'studentregistrypanel'
            },
            {
                xtype:'courseboxpanel'
            },
            {
                xtype:'exampanel'
            },
            {
                xtype:'scorepanel'
            }
        ]
    }


});
