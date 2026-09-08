export default function UserImage({
  imageURL,
  username,
  size = 'medium',
}: {
  imageURL?: string;
  username: string;
  size?: 'small' | 'medium' | 'large';
}) {
  return (
    <div
      className={`rounded-full overflow-hidden ${size === 'small' ? 'w-8 h-8 min-w-8' : size === 'medium' ? 'w-10 h-10 min-w-10' : 'w-14 h-14 min-w-14'}`}>
      {imageURL ? (
        <img src={imageURL} alt={username} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
          <span className="font-bold text-muted-foreground">{username[0]}</span>
        </div>
      )}
    </div>
  );
}
