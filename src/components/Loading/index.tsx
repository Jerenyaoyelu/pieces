interface LoadingProp {
  text?: string;
}

export const Loading: React.FC<LoadingProp> = ({ text }) => {
  return (
    <div className='absolute left-0 top-1/2 z-10 w-full flex flex-col items-center'>
      <progress className="progress w-56"></progress>
      <div className='mt-2'>{text}</div>
    </div>
  )
}