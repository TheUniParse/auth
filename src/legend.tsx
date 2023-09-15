export default function Legend({ children, border }: any) {
  return (
    <h3 className='my-0 flex items-center px-2'>
      <span
        className={`h-0 basis-full border-[thin] border-${
          border || 'solid'
        }`}
      />

      <span className='px-1'>{children}</span>

      <span
        className={`h-0 basis-full border-[thin] border-${
          border || 'solid'
        }`}
      />
    </h3>
  )
}
