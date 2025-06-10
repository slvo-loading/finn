import type { UIMessage } from 'ai';

export function RenderResponse({ messages }: { messages: UIMessage[] }) {
    return (
        <div className="flex flex-col gap-3 p-4">
          {messages.map(message => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-md whitespace-pre-wrap ${message.role === 'user'
                  ? 'bg-gray-200'
                  : ''
                }`}>
                  {message.parts.map((part, index) => {
                    switch(part.type) {
                      case 'text':
                        return <span key={index}>{part.text}</span>
                    }
                  })}
                  </div>
              </div>
          ))}
        </div> 
      )
}