export default function Log({ message }: any) {
  return (
    <fieldset className='fixed bottom-3 left-3 rounded-lg border-[thin] border-dashed border-yellow-500 bg-[#222b] px-2 pt-0'>
      <legend className='text-2xl'>log</legend>
      <pre className='break-word text-left'>{message}</pre>
    </fieldset>
  )
}
