import React from 'react';

const Channel = ({name, selected, onClick}) => {
  const className = selected ? "ChannelList-item ChannelList-item-selected" : "ChannelList-item";
  return <div onClick={onClick} className={className}>{name}</div>;
}

const ChannelList = ({channels, selectedChannelId, onSelect}) => (
  <div className="ChannelList">
    {
      channels.map(({id, name}) => {
        const is_selected = selectedChannelId === id;
        const onChannelSelect = () => onSelect(id);
        return <Channel key={id} name={name} selected={is_selected} onClick={onChannelSelect} />
      })
    }
  </div>
);

export default ChannelList;
