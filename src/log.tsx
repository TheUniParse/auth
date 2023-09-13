export default function Log({ message }: any) {
  return (
    <fieldset className='fixed border-yellow-500 bottom-0 left-5 rounded-lg border-[thin] border-dashed bg-[#222b] px-2'>
      <legend className='text-left text-2xl'>log</legend>
      <pre className='break-word text-left'>{message}</pre>
    </fieldset>
  )
}
