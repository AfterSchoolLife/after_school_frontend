
import ProgramDetail from './programDetail';
import axiosInstance from '@components/axiosInstance';

export default async function ProgramPage({ params }) {
    const { id } = params;
    const response = await axiosInstance.get(`/api/v1/programs/${id}`);
    const program = response.data;

    return <ProgramDetail program={program} />;
}

// Optional: Use this if you're generating static pages during build time
export async function generateStaticParams() {
    const response = await axiosInstance.get('/api/v1/programs');
    const programs = response.data;

    return programs.map((program) => ({
        id: program.id.toString(),
    }));
}
