import React, { Component } from 'react'
import GroupForm from './GroupForm'
import KindForm from './KindForm'
import UrlForm from './UrlForm'
import 'babel-polyfill' //ないとasyncでエラー
import Modal from './modal'
import styled, { keyframes, css } from 'styled-components'
import { Label, Button } from './CommonStyle'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Reorder, getUrlStyle, getListStyle } from './dnd/utils'

class Master extends Component {
  constructor() {
    super()
    this.state = {
      group: {},
      kind: {},
      url: {},
      inputGroup: {},
      isModalShown: false,
      modal: null,
      hoverId: null,
    }
    this.importRef = null
    this.order = this.order.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  updateState(state) {
    this.setState(state)
  }

  componentDidMount() {
    this.getJSON('group').then((result) => this.setState({ group: result }))
    this.getJSON('kind').then((result) => this.setState({ kind: result }))
    this.getJSON('url').then((result) => this.setState({ url: result }))
  }

  async getJSON(val) {
    let items = await this.getLocalStorage(val)
    if (!items || items.length == 0) {
      items = '{}'
    }
    return JSON.parse(items)
  }

  getLocalStorage(val) {
    return new Promise((resolve) => {
      chrome.storage.local.get([val], (result) => resolve(result[val]))
    })
  }

  save(val, obj) {
    let items = this.state[val]
    let urls = this.state.url
    switch (val) {
      case 'group':
        if (!obj.gid) obj.gid = 'x' + new Date().getTime().toString(16)
        items[obj.gid] = {
          name: obj.name,
        }
        break
      case 'kind':
        if (!obj.kid) obj.kid = 'x' + new Date().getTime().toString(16)
        items[obj.kid] = {
          bgColor: obj.bgColor,
          color: obj.color,
          text: obj.text,
        }
        break
      case 'url':
        if (!obj.uid) obj.uid = 'x' + new Date().getTime().toString(16)
        const isExist = Object.keys(urls).some((uid) => {
          return urls[uid].url == obj.url
        })
        if (isExist) return alert('The URL has already been registered')
        items[obj.uid] = {
          url: obj.url,
          gid: obj.gid,
          kid: obj.kid,
          reg: obj.reg,
          order: obj.order,
        }
        if (obj.kid == 'nokind') {
          items[obj.uid] = {
            ...items[obj.uid],
            bgColor: obj.bgColor,
            color: obj.color,
            text: obj.text,
          }
        }
        break
      case 'order':
        const sortedArray = Reorder(
          obj.unSortArray, //[v0, v1, v2, v3]
          obj.sourceIndex, // 2
          obj.destinationIndex // 3
        ) // [v0, v1, v3, v2]
        sortedArray.map((v, i) => (urls[v.uid].order = i))
        // 例外
        items = urls
        val = 'url'
        break
      default:
        return
    }
    const json = JSON.stringify(items)
    ;(async () => {
      await chrome.storage.local.set({ [val]: json })
      this.setState({ [val]: items })
    })()
  }

  delete(val, id) {
    let items = this.state[val]
    delete items[id]
    const json = JSON.stringify(items)
    ;(async () => {
      await chrome.storage.local.set({ [val]: json })
      this.setState({ [val]: items })
    })()
  }

  deleteAll() {
    const result = window.confirm('Can you really delete registered data?')
    if (!result) return
    ;(async () => {
      chrome.storage.local.clear()
    })()
    location.reload()
  }

  onHoverEnter = (hoverId) => {
    this.setState({ hoverId })
  }

  onHoverLeave = () => {
    this.setState({ hoverId: null })
  }

  onRenderUrl(urls, uid, gid, i) {
    const url = urls[uid]
    const kind = url.kid != 'nokind' ? this.state.kind[url.kid] : url
    //undefined => urlがどのkindにも所属していない
    return (
      <Draggable key={`${gid}${uid}`} draggableId={`${gid}${uid}`} index={i}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={getUrlStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
            {...provided.dragHandleProps}
          >
            <Li
              key={uid}
              onMouseEnter={() => this.onHoverEnter('u' + uid)}
              onMouseLeave={this.onHoverLeave}
            >
              <DeleteButton
                hovering={'u' + uid == this.state.hoverId}
                onClick={() => this.delete('url', uid)}
              ></DeleteButton>
              {url.reg ? (
                <span>{url.url}</span>
              ) : (
                <a href={url.url} target="_blank" rel="noreferrer noopener">
                  {url.url}
                </a>
              )}
              ：
              <span
                style={{
                  background: kind.bgColor,
                  color: kind.color,
                  padding: '0 1rem',
                }}
              >
                <span>{kind.text}</span>
              </span>
            </Li>
          </div>
        )}
      </Draggable>
    )
  }

  order(urlObjs, gid) {
    var arr = []
    const urls = Object.keys(urlObjs)
    if (urls.length == 0) return arr
    urls.map((uid) => {
      if (urlObjs[uid].gid != gid) return
      const key = urlObjs[uid].order
      urlObjs[uid].uid = uid
      arr[key] = urlObjs[uid]
    })
    return arr
  }

  onDragEnd(result) {
    if (!result.destination) {
      return
    }
    this.save('order', {
      unSortArray: this.order(this.state.url, result.type),
      sourceIndex: result.source.index,
      destinationIndex: result.destination.index,
    })
  }

  onRenderUrlTree() {
    const urls = this.state.url
    const groups = this.state.group
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        {Object.keys(groups).map((gid, index) => {
          return (
            <Ul key={gid}>
              <GroupTitle>"{groups[gid].name + ' Group'}"</GroupTitle>
              <Droppable droppableId={`droppableGid${gid}`} type={gid}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {urls &&
                      this.order(urls, gid).map((v, i) =>
                        this.onRenderUrl(urls, v.uid, gid, i)
                      )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              {this.onRenderRegisterUrlButton(gid)}
            </Ul>
          )
        })}
      </DragDropContext>
    )
  }

  onRenderKinds() {
    const kinds = this.state.kind
    const result = Object.keys(kinds).map((kid) => {
      return (
        <Li
          key={kid}
          style={{ padding: 12 }}
          onMouseEnter={() => this.onHoverEnter('k' + kid)}
          onMouseLeave={this.onHoverLeave}
        >
          <DeleteButton
            hovering={'k' + kid == this.state.hoverId}
            onClick={() => this.delete('kind', kid)}
          ></DeleteButton>
          <span
            style={{
              backgroundColor: kinds[kid].bgColor,
              color: kinds[kid].color,
            }}
          >
            {kinds[kid].text || '　'}
          </span>
        </Li>
      )
    })
    return <ul>{result}</ul>
  }

  exportJSON() {
    let data = {
      url: this.state.url,
      group: this.state.group,
      kind: this.state.kind,
    }
    ;(async () => {
      const filename = 'distinguish.json'
      let blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      let url = URL.createObjectURL(blob)
      chrome.downloads.download({
        filename: filename,
        url: url,
      })
    })()
  }

  importJSON(e) {
    let result = e.target.files[0]
    let reader = new FileReader()
    reader.readAsText(result)
    reader.addEventListener('load', () => {
      //とりあえずparseできない改行コードを除く)
      reader.result.replace(/\u2028|\u2029/g, '')
      let json
      try {
        json = JSON.parse(reader.result)
      } catch (e) {
        return alert(e + '\nPlease select ther correct JSON file')
      }
      Object.keys(json).forEach((key) => {
        ;(async (key, json) => {
          await chrome.storage.local.set({ [key]: JSON.stringify(json[key]) })
        })(key, json)
      })
      this.getJSON('group').then((result) => this.setState({ group: result }))
      this.getJSON('kind').then((result) => this.setState({ kind: result }))
      this.getJSON('url').then((result) => this.setState({ url: result }))
    })
  }

  onRenderRegisterUrlButton(gid) {
    return (
      <RegisterButton
        onClick={() => {
          this.setState({
            isModalShown: true,
            modal: (
              <UrlForm
                gid={gid}
                urls={this.state.url}
                kinds={this.state.kind}
                save={(val, obj) => this.save(val, obj)}
              />
            ),
          })
        }}
      >
        Add
      </RegisterButton>
    )
  }

  onRenderRegisterKindButton() {
    return (
      <RegisterButton
        onClick={() => {
          this.setState({
            isModalShown: true,
            modal: <KindForm save={(val, obj) => this.save(val, obj)} />,
          })
        }}
      >
        Add
      </RegisterButton>
    )
  }

  render() {
    return (
      <Container>
        <H1>Distinguish</H1>
        <Section>
          {this.state.isModalShown && (
            <Modal
              view={this.state.modal}
              onClose={() => {
                this.setState({ isModalShown: false })
              }}
            />
          )}
          <GroupForm
            save={(val, obj) => this.save(val, obj)}
            updateState={this.updateState.bind(this)}
          />
          {Object.keys(this.state.group).length ? (
            <div>
              <hr />
              <Label>URL</Label>
              {this.onRenderUrlTree()}
            </div>
          ) : null}
          <hr />
          <Label>Text And Color</Label>
          <div style={{ margin: 10 }}>
            {this.onRenderKinds()}
            {this.onRenderRegisterKindButton()}
          </div>
          <hr />
          <Label>Data Management</Label>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: 10,
            }}
          >
            <ExportButton onClick={this.exportJSON.bind(this)}>
              Export
            </ExportButton>
            <ImportButton onClick={() => this.importRef.click()}>
              Import
            </ImportButton>
            {/* リセットボタン残すか検討する*/}
            <Button onClick={this.deleteAll}>All Reset</Button>
          </div>
          <input
            type="file"
            onChange={this.importJSON.bind(this)}
            accept=".json"
            ref={(component) => (this.importRef = component)}
            style={{ visibility: 'hidden' }}
          />
        </Section>
      </Container>
    )
  }
}

const H1 = styled.h1`
  font-size: 30px;
`
const Container = styled.div`
  margin: 10px;
`

const Section = styled.section`
  padding: 10px;
`

const Ul = styled.ul`
  margin: 10px;
  margin-left: 20px;
`

const GroupTitle = styled.span`
  font-weight: bold;
  　　margin: 10px;
`

const skew = keyframes`
    0% {transform: skew(0deg, 0deg);}
    5% {transform: skew(5deg, 4.2deg);}
    10% {transform: skew(-4deg, -3deg);}
    15% {transform: skew(3deg, 2.2deg);}
    20% {transform: skew(-2deg, -1.5deg);}
    25% {transform: skew(0.9deg, 0.9deg);}
    30% {transform: skew(-0.6deg, -0.6deg);}
    35% {transform: skew(0.3deg, 0.3deg);}
    40% {transform: skew(-0.2deg, -0.2deg);}
    45% {transform: skew(0.1deg, 0.1deg);}
    50% {transform: skew(0deg, 0deg);}
`

const DeleteButton = styled.div`
  display: inline-block;
  ${(props) =>
    props.hovering
      ? css`
          cursor: pointer;
          width: 20px;
          height: 20px;
          margin: 5px;
          background-color: #f00;
          line-height: 5px;
          border-radius: 20px;
          position: relative;
          animation: ${skew} 1.3s linear infinite;
          &:after {
            position: absolute;
            content: '';
            width: 15px;
            height: 3px;
            background-color: #fff;
            display: inline-block;
            top: calc(50% - 1.5px);
            right: 2px;
          }
        `
      : css`
          width: 20px;
          height: 20px;
          margin: 5px;
          line-height: 5px;
          &::after {
            content: '・';
            line-height: normal;
          }
        `}
`

const ExportButton = styled(Button)`
  &:after {
    content: '';
    display: inline-block;
    margin-left: 10px;
    width: 15px;
    height: 20px;
    background-image: url(../img/file-download-solid.svg);
    background-size: contain;
    vertical-align: middle;
  }
`

const ImportButton = styled(Button)`
  &:after {
    content: '';
    display: inline-block;
    margin-left: 10px;
    width: 15px;
    height: 20px;
    background-image: url(../img/file-upload-solid.svg);
    background-size: contain;
    vertical-align: middle;
  }
`

const Li = styled.li`
  line-height: 2;
  margin-left: 25px;
  display: flex;
`

const RegisterButton = styled(Button)`
  margin-left: 50px;
  display: block;
  width: 100px;
  height: 30px;
  line-height: 3px;
`

export default Master
