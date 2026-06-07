export function setupFileDrop(
  overlay: HTMLElement,
  onFile: (content: string, filename: string) => void
): void {
  let dragCounter = 0

  const show = () => overlay.classList.add('visible')
  const hide = () => overlay.classList.remove('visible')

  document.addEventListener('dragenter', (e) => {
    e.preventDefault()
    dragCounter++
    show()
  })

  document.addEventListener('dragleave', () => {
    dragCounter--
    if (dragCounter <= 0) {
      dragCounter = 0
      hide()
    }
  })

  document.addEventListener('dragover', (e) => e.preventDefault())

  document.addEventListener('drop', (e) => {
    e.preventDefault()
    dragCounter = 0
    hide()
    const file = e.dataTransfer?.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onFile(reader.result as string, file.name)
    reader.readAsText(file)
  })
}
