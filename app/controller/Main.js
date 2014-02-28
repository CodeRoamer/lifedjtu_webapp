/**
 * Created by apple on 12/23/13.
 */
Ext.define('LifeDJTU.controller.Main',{
    extend: 'Ext.app.Controller',

    config: {

        refs: {
            userPanel: '#user-panel',
            userPanelToolbar : '#user-panel-toolbar',
            homeButton: '#menu_0',
            changePassButton : '#menu_1',
            queryRoomButton:'#menu_2',
            studentRegistryButton:'#menu_3',
            courseBoxButton:'#menu_4',
            examButton:'#menu_5',
            scoreButton:'#menu_6'
        },
        control: {
            homeButton: {
                tap: 'onHomeButtonTap'
            },
            changePassButton:{
                tap : 'onChangePassButtonTap'
            },
            queryRoomButton:{
                tap : 'onQueryRoomButtonTap'
            },
            studentRegistryButton:{
                tap : 'onStudentRegistryButtonTap'
            },
            courseBoxButton:{
                tap : 'onCourseBoxButtonTap'
            },
            examButton:{
                tap : 'onExamButtonTap'
            },
            scoreButton:{
                tap : 'onScoreButtonTap'
            }
        }
    },

    onHomeButtonTap : function(self){
        this.menuButtonTap(self);
    },
    onChangePassButtonTap: function(self){
        this.menuButtonTap(self);
    },
    onQueryRoomButtonTap:function(self){
        this.menuButtonTap(self);

    },
    onStudentRegistryButtonTap:function(self){
        this.menuButtonTap(self);

    },
    onCourseBoxButtonTap:function(self){
        this.menuButtonTap(self);

    },
    onExamButtonTap:function(self){
        this.menuButtonTap(self);

    },
    onScoreButtonTap:function(self){
        this.menuButtonTap(self);

    },

    menuButtonTap:function(button){
        var id = button.getId();
        this.getUserPanel().setActiveItem(parseInt(id.substring(id.lastIndexOf('_')+1)));
        this.getUserPanelToolbar().setTitle(button.getText());
        Ext.Viewport.hideMenu('left');
    }
})