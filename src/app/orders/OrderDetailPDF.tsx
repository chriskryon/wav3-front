import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { mockOrderDetail } from './OrderDetailModal';

// Estilos refinados para o PDF estilo invoice moderno e compacto
const pdfStyles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica', backgroundColor: '#f5f5f5' },
  header: { marginBottom: 20, textAlign: 'center', borderBottom: '1px dashed #1ea3ab', paddingBottom: 10 },
  logo: { width: 100, marginBottom: 5, alignSelf: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1ea3ab' },
  section: { marginBottom: 15 },
  card: { marginBottom: 10, padding: 15, border: '1px dashed #1ea3ab', borderRadius: 5, backgroundColor: '#ffffff' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  text: { marginBottom: 4, color: '#555' },
  timelineCard: { marginTop: 8, padding: 10, border: '1px dashed #1ea3ab', borderRadius: 5, backgroundColor: '#ffffff' },
  timelineItem: { marginBottom: 8, padding: 8, borderBottom: '1px dashed #1ea3ab' },
  timelineTitle: { fontSize: 12, fontWeight: 'bold', color: '#1ea3ab' },
  timelineText: { fontSize: 10, color: '#555' },
  footer: { position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: '#999' },
});

// Componente PDF refinado estilo invoice moderno e compacto
export const OrderDetailPDF = ({ order, user }: { order: typeof mockOrderDetail; user: any }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {/* Header com logo e título */}
      <View style={pdfStyles.header}>
        <Image
          style={pdfStyles.logo}
          src={require('../logo.svg')}
        />
        <Text style={pdfStyles.title}>Wav3 Order - {order.id}</Text>
      </View>

      {/* Detalhes do usuário */}
      <View style={pdfStyles.card}>
        <Text style={pdfStyles.cardTitle}>User Details</Text>
        <Text style={pdfStyles.text}>Name: {user.name}</Text>
        <Text style={pdfStyles.text}>Email: {user.email}</Text>
        <Text style={pdfStyles.text}>Country: {user.account.country}</Text>
        <Text style={pdfStyles.text}>Address: {user.account.address}</Text>
        <Text style={pdfStyles.text}>Phone: {user.account.phone}</Text>
      </View>

      {/* Detalhes da ordem */}
      <View style={pdfStyles.card}>
        <Text style={pdfStyles.cardTitle}>Order Information</Text>
        <Text style={pdfStyles.text}>Order ID: {order.id}</Text>
        <Text style={pdfStyles.text}>Status: {order.status}</Text>
        <Text style={pdfStyles.text}>From: {order.source_amount} {order.source_asset}</Text>
        <Text style={pdfStyles.text}>To: {order.target_amount} {order.target_asset}</Text>
        <Text style={pdfStyles.text}>Recipient Email: {order.recipient_email}</Text>
        <Text style={pdfStyles.text}>Description: {order.description}</Text>
        <Text style={pdfStyles.text}>Created At: {new Date(order.created_at).toLocaleString()}</Text>

        {/* Card da timeline */}
        <View style={pdfStyles.timelineCard}>
          <Text style={pdfStyles.cardTitle}>Timeline</Text>
          {order.timelines.map((step, idx) => (
            <View key={idx} style={pdfStyles.timelineItem}>
              <Text style={pdfStyles.timelineTitle}>Step: {step.order_step}</Text>
              <Text style={pdfStyles.timelineText}>Executed: {step.executed ? 'Yes' : 'No'}</Text>
              {step.executed_at !== '0001-01-01T00:00:00Z' && (
                <Text style={pdfStyles.timelineText}>Executed At: {new Date(step.executed_at).toLocaleString()}</Text>
              )}
              {step.comments && <Text style={pdfStyles.timelineText}>Comments: {step.comments}</Text>}
            </View>
          ))}
        </View>
      </View>

      {/* Rodapé */}
      <View style={pdfStyles.footer}>
        <Text>For internal use only – not a legally binding document</Text>
      </View>
    </Page>
  </Document>
);
