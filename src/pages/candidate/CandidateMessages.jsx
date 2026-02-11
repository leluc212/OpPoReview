import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { Send, Search } from 'lucide-react';
import { Input, Button } from '../../components/FormElements';

const MessagesContainer = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 0;
  height: calc(100vh - 104px);
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
`;

const ConversationList = styled.div`
  border-right: 1px solid ${props => props.theme.colors.border};
  overflow-y: auto;
`;

const SearchBox = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ConversationItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: background ${props => props.theme.transitions.fast};
  background: ${props => props.$active ? props.theme.colors.bgDark : 'transparent'};
  
  &:hover {
    background: ${props => props.theme.colors.bgDark};
  }
`;

const ConversationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  
  h4 {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }
  
  time {
    font-size: 12px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const ConversationPreview = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatArea = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ChatHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const MessagesArea = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

const Message = styled.div`
  display: flex;
  justify-content: ${props => props.$sent ? 'flex-end' : 'flex-start'};
  margin-bottom: 16px;
`;

const MessageBubble = styled.div`
  max-width: 60%;
  padding: 12px 16px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$sent ? props.theme.colors.gradientPrimary : props.theme.colors.bgDark};
  color: ${props => props.$sent ? 'white' : props.theme.colors.text};
  
  p {
    margin-bottom: 4px;
  }
  
  time {
    font-size: 12px;
    opacity: 0.7;
  }
`;

const InputArea = styled.div`
  padding: 20px 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 12px;
`;

const CandidateMessages = () => {
  const [activeConv, setActiveConv] = useState(1);
  const [message, setMessage] = useState('');

  const conversations = [
    { id: 1, company: 'TechCorp', lastMessage: 'Thanks for applying!', time: '10:30 AM', unread: true },
    { id: 2, company: 'StartupXYZ', lastMessage: 'When can you start?', time: 'Yesterday', unread: false },
  ];

  const messages = [
    { id: 1, text: 'Hello! We received your application', sent: false, time: '10:15 AM' },
    { id: 2, text: 'Thank you! Looking forward to hearing from you', sent: true, time: '10:20 AM' },
    { id: 3, text: 'We would like to schedule an interview', sent: false, time: '10:30 AM' },
  ];

  return (
    <DashboardLayout role="candidate" showSearch={false}>
      <MessagesContainer>
        <ConversationList>
          <SearchBox>
            <Input placeholder="Search messages..." />
          </SearchBox>
          {conversations.map(conv => (
            <ConversationItem key={conv.id} $active={activeConv === conv.id} onClick={() => setActiveConv(conv.id)}>
              <ConversationHeader>
                <h4>{conv.company}</h4>
                <time>{conv.time}</time>
              </ConversationHeader>
              <ConversationPreview>{conv.lastMessage}</ConversationPreview>
            </ConversationItem>
          ))}
        </ConversationList>

        <ChatArea>
          <ChatHeader>
            <h3>TechCorp</h3>
            <p>Recruiter</p>
          </ChatHeader>

          <MessagesArea>
            {messages.map(msg => (
              <Message key={msg.id} $sent={msg.sent}>
                <MessageBubble $sent={msg.sent}>
                  <p>{msg.text}</p>
                  <time>{msg.time}</time>
                </MessageBubble>
              </Message>
            ))}
          </MessagesArea>

          <InputArea>
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button $variant="primary">
              <Send />
            </Button>
          </InputArea>
        </ChatArea>
      </MessagesContainer>
    </DashboardLayout>
  );
};

export default CandidateMessages;
