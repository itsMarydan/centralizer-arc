import React from 'react';
import styled from 'styled-components'
import {Draggable} from "react-beautiful-dnd";

const Container =  styled.div`
  display: flex;
  background-color: white;
  padding: 8px;
  flex-direction: column;
  width: 220px;
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px`;


type ComProps = {
    app: any,
    index: any,
    unpinApp: any,

}
export default class Column extends React.PureComponent<ComProps> {

    render() {
        return (
            <Draggable key={this.props.app.appSlug} draggableId={this.props.app.appSlug} index={this.props.index}>
                {(provided: any)=> (
                    <Container
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <div className="d-flex justify-content-between">
                            <div className="d-flex flex-row align-items-center">
                                <div className="title">
                                    <h6 className="mb-0">{this.props.app.appName}</h6> <span className="small">{this.props.app.appSlug}</span>
                                </div>
                            </div>
                            <button onClick={() => this.props.unpinApp(this.props.app.appSlug)} className="badge btn"><span>detach</span></button>
                        </div>
                        <div className="mt-5">
                            <a href={`/app/${this.props.app.appSlug}`}>
                                <span><span className="color-blue mr-2">#</span>Content: {this.props.app.contentCount}</span>
                                <span><span className="color-blue mr-2">#</span>Forms: {this.props.app.formCount}</span>
                                <span><span className="color-blue mr-2">#</span>Files: {this.props.app.fileCount}</span>
                            </a>
                        </div>
                    </Container>
                )}
            </Draggable>
        )
    }
}