import React from "react";
import Column from "./column";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import styled from "styled-components";
import {userUtils} from "../../static/user-utils"
import {updatePinnedAppsOrder} from "../../features/auth/authSlice";
import authApi from "../../api/authApi";

const Container = styled.div`
display: flex;
`

type InnerProps = {
    app: any;
    index: any;
    unpinApp: any;
}

type MyProps = {
    currentUser: any;
    permittedApps: any;
    currentUserOptions: any;
    appOrder: any;
    dispatch: any;
    unpinApp: any;

};

type MyState = {

}
class InnerList extends React.PureComponent<InnerProps> {

    render() {
        const { app, index} = this.props;
        return <Column unpinApp={this.props.unpinApp} key={app.appSlug} app={app} index={index} />
    }
}

export default class PinnedApplications extends React.PureComponent<MyProps, MyState>{
        createPinnedApps(): any {
        const newValue: any =[]
        this.props.appOrder.forEach((app: any )=> {
            const pinned = this.props.permittedApps.find((item: any) => item.appSlug === app)
            newValue.push(pinned)
        });
    
        return newValue;
    }

    async retrieveNewOptions(updates: any, newOrder: Array<String>){
        authApi.updateOptions(this.props.currentUser.userId, userUtils.PINNED_APPS, updates);
        this.props.dispatch(updatePinnedAppsOrder(newOrder))
    }
    userOptionsArray: any = this.props.currentUserOptions;

    onDragEnd = (result: any) => {
        const {destination, type, source, draggableId} = result;
        if(!destination)return
        if(destination.droppableId === source.droppableId && destination.index === source.index) return;
        if(type === 'column'){
            const newAppOrder: Array<String> = Array.from(this.props.appOrder);
            newAppOrder.splice(source.index, 1);
            newAppOrder.splice(destination.index, 0, draggableId);
            const updates = {
                "optionConfig": {
                    "appOrder": newAppOrder
                }
            }
            this.retrieveNewOptions(updates, newAppOrder).then();
            return
        }
    }


    render() {
        return (
            <div className="div">
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId={"all-columns"} direction="horizontal" type="column">
                        {(provided) => (
                            <Container
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {this.createPinnedApps() ?  this.createPinnedApps().map((item: any, index: any) => {
                                    const app = this.createPinnedApps().find((app:any) => app.appSlug === item.appSlug)
                                    return <InnerList unpinApp={this.props.unpinApp} key={app.appSlug} app={app} index={index}  />;
                                }) : null}
                                {provided.placeholder}
                            </Container>)}
                    </Droppable>
                </DragDropContext>
            </div>
        )
    }

}