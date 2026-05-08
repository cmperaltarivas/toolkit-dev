interface Props {
  msg: string;
  type: 'success' | 'error';
}

export default function Toast({ msg, type }: Props) {
  return (
    <div className="toast-container">
      <div className={`toast toast-${type}`}>
        {msg}
      </div>
    </div>
  );
}
