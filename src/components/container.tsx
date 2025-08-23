type ContainerProps = {
  children: React.ReactNode;
};

const Container = ({ children }: ContainerProps) => {
  return (
    //max width - 1536px
    <div className="flex flex-col mx-auto max-w-screen-2xl">
      {children}
    </div>
  );
};

export default Container;
